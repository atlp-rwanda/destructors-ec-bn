import { Server } from 'socket.io';
import { findUserById } from './user.service';
import { Chat, User, Products, Notifications, Mark_Notifications } from '../database/models';
import verfyToken from '../utils/verifytoken';
import { Op } from 'sequelize';
import { eventEmitter } from '../events/eventEmitter';


function initializeChat(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', async (socket) => {
    socket.on('newuser', async (userId) => {
      const user = await findUserById(userId);
      socket.broadcast.emit(
        'update',
        user.firstname + ' joined the conversation'
      );
      // console.log(user.firstname)
      const messages = await Chat.findAll({
        include: User,
        attributes: ['senderId', 'message', 'createdAt'],
        order: [['createdAt', 'ASC']],
        limit: 50,
      });
      const messagesData = messages.map((message) => ({
        username: message.User.firstname,
        isMine: userId == message.senderId,
        text: message.message,
        time:message.createdAt.toLocaleString(undefined, {
          hour: 'numeric',
          minute: 'numeric',
          weekday: 'short',
        }),
      }));
      socket.emit('getOldMessages', messagesData);
    });
    socket.on('exituser', (username) => {
      socket.broadcast.emit('update', username + ' left the conversation');
    });
    socket.on('chat', async ({ userId, text }) => {
      const user = await findUserById(userId);
      const sender_username = user.firstname;
      const currentTime=new Date()
      const formattedTime = currentTime.toLocaleString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
        weekday: 'long',
      });
      Chat.create({ senderId: userId, message: text,createdAt:currentTime });
      socket.broadcast.emit('chat', {
        username: sender_username,
        text,
        time: formattedTime
      });
    });

  });

  /* -------Notification socket------- */


  const notifyNamespace = io.of('/notifications');

  notifyNamespace.use(async (socket, next) => {
    try {
      if (socket.handshake.headers.authorization) {
        const { authorization } = socket.handshake.headers;
        const token = authorization.split(' ')[1];

        if (!token) {
          const err = new Error("First login");
          return next(err);
        }

        const user = verfyToken(token, process.env.JWT_SECRET)
        const userDetails = await findUserById(user.data.id)
        if (!userDetails) {

          const err = new Error("unauthorized");
          return next(err);
        }

        socket.user = userDetails;
        socket.id = userDetails.id

        return next();

      } else {
        const err = new Error("sign in first");
        return next(err);
      }
    } catch (error) {
      const err = new Error("Someting went wrong!! Try Again");
      return next(err);
      console.log(error)
    }
  })


  notifyNamespace.on('connection', async (socket) => {

    console.log(`🔔: ${socket.id} user just connected`);
    console.log(`🔔: ${socket.user.email}`);

    socket.emit('login', socket.user.lastname)
    let room;
    const outStockProducts = await Products.findAll({
      where: {
        quantity: { [Op.lte]: 5 },
        sellerId: socket.id
      }
    });
    const bonusOnProduct = await Products.findAll({
      where: {
        bonus: { [Op.gt]: 0 },
      }
    });
    const expiredProducts = await Products.findAll({
      where: {
        expiryDate: {
          [Op.lt]: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
          [Op.gte]: new Date()
        },
        sellerId: socket.id
      }
    });

    if (socket.user.role === 'seller') {
      room = socket.user.role;
      socket.join(room);
      const sellerNotifications = await Notifications.findAll({ where: { receiver: socket.id }, order: [['createdAt', 'DESC']] });
      const notificationStatus = await Mark_Notifications.findAll({ where: { receiverId: socket.id } });
      let notifications = [];
      sellerNotifications.map((data) => {
         
        notificationStatus.forEach(element => {
          if (element.notificationId === data.id) {
            const notificationDetails = {
              id: data.id,
              subject: data.subject,
              message: data.message,
              status: element.is_read,time: data.createdAt.toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }),
            }
            notifications.push(notificationDetails);
          }
        });


      })



      notifyNamespace.to(socket.id).emit('old-notification', notifications);
      notifyNamespace.to(socket.id).emit('outOfStock-notification', outStockProducts);
    } else {
      room = socket.user.role;
      socket.join(room)
      const notifications = await Notifications.findAll({ where: { receiver: 'buyer' }, order: [['createdAt', 'DESC']] });
      const specificBuyNotif = await Notifications.findAll({ where: { receiver: socket.id }, order: [['createdAt', 'DESC']] });
      const notificationStatus = await Mark_Notifications.findAll({ where: { receiverId: socket.id } });
      let allNotification = [];
      let buyerNotification = [];
      notifications.map(async (data) => {
        notificationStatus.forEach(element => {
          if (element.notificationId === data.id) {
            const notificationDetails = {
              id: data.id,
              subject: data.subject,
              message: data.message,
              status: element.is_read,
              time: data.createdAt.toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }),
            };
            allNotification.push(notificationDetails);

          }
        });

      })

      specificBuyNotif.map(async (data) => {
        notificationStatus.forEach(element => {
          if (element.notificationId === data.id) {
            const notificationDetails = {
              id: data.id,
              subject: data.subject,
              message: data.message,
              status: element.is_read,
              time: data.createdAt.toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }),
            };
            buyerNotification.push(notificationDetails);

          }
        });

      })


      notifyNamespace.to(socket.id).emit('old-notification', allNotification);
      notifyNamespace.to(socket.id).emit('old-notification', buyerNotification);
      notifyNamespace.to('buyer').emit('productBonus-notification', bonusOnProduct);
    }
  });
  const notifyUser = async (subject, message, entityId, receiver) => {
    const newNotification = await Notifications.create({
      subject,
      message,
      entityId,
      receiver,
    });
    return newNotification;
  }

  const markNotications = async (notificationId, receiverId, is_read) => {
    const notificationStatus = await Mark_Notifications.create({
      notificationId,
      receiverId,
      is_read,
    });
    return notificationStatus;

  }

  eventEmitter.on('notifySeller', async (notificationDetails) => {
    const message = {
      text: notificationDetails.message,
      image: notificationDetails.productImage
    }
    const newNotification = await notifyUser(notificationDetails.subject, message, notificationDetails.entityId, notificationDetails.receiver, notificationDetails.receiver)
    notifyNamespace.to(notificationDetails.receiver).emit('new-notification', notificationDetails.subject, notificationDetails.message, notificationDetails.productImage, newNotification.id);
    markNotications(newNotification.id, notificationDetails.receiverId)
  })
  eventEmitter.on('notifySellers', async (notificationDetails) => {
    const message = {
      text: notificationDetails.message,
      image: notificationDetails.productImage[0]
    }
    const newNotification = await notifyUser(notificationDetails.subject, message, notificationDetails.entityId, notificationDetails.receiver)
    notifyNamespace.to(notificationDetails.receiver).emit('new-notification', notificationDetails.subject, notificationDetails.message, notificationDetails.productImage, newNotification.id);
    markNotications(newNotification.id, notificationDetails.receiverId)
  })
  eventEmitter.on('notifyBuyer', async (notificationDetails) => {
    const message = {
      text: notificationDetails.message,
      image: notificationDetails.productImage
    };
    const newNotification = await notifyUser(notificationDetails.subject, message, notificationDetails.entityId, notificationDetails.receiver)
    notifyNamespace.to(notificationDetails.receiver).emit('new-notification', notificationDetails.subject, notificationDetails.message, newNotification.id);
    markNotications(newNotification.id, notificationDetails.receiverId)
  })
  eventEmitter.on('newOrderNotification', async (notificationDetails) => {
    const message = {
      text: notificationDetails.message,
      image: notificationDetails.productImage[0]
    }
    const newNotification = await notifyUser(notificationDetails.subject, message, notificationDetails.entityId, notificationDetails.receiver)
    notifyNamespace.to(notificationDetails.receiver).emit('new-notification', notificationDetails.subject, notificationDetails.message, notificationDetails.productImage, newNotification.id);
    markNotications(newNotification.id, notificationDetails.receiverId)
  })

  return { io, notifyNamespace }
}


export { initializeChat };