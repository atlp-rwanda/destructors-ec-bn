import { Server } from 'socket.io';
import { findUserById } from './user.service';
import { Chat, User, Products, Notifications } from '../database/models';
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
      }));
      socket.emit('getOldMessages', messagesData);
    });
    socket.on('exituser', (username) => {
      socket.broadcast.emit('update', username + ' left the conversation');
    });
    socket.on('chat', async ({ userId, text }) => {
      const user = await findUserById(userId);
      const sender_username = user.firstname;
      Chat.create({ senderId: userId, message: text });
      socket.broadcast.emit('chat', {
        username: sender_username,
        text,
      });
    });

  });

      /* -------Notification socket------- */


  const notifyNamespace = io.of('/notifications');

  notifyNamespace.use((socket, next) => {
    try {
     if (socket.handshake.headers.authorization){
      const { authorization } = socket.handshake.headers;
      const token = authorization.split(' ')[1];
      const user = verfyToken(token, process.env.JWT_SECRET)

      if (!user) {

        const err = new Error("not authorized");
        console.log('unauthorized')
        return next(err);
      }
      socket.user = user.data;
      socket.id = user.data.id

      return next();
     } else {
      const err = new Error("sign in first");
      return next(err);
     }
    } catch (error){
      console.log(error)
    }
  })

let userId;
  notifyNamespace.on('connection', async (socket) => {
    userId = socket.id;
    console.log(`🔔: ${socket.id} user just connected`);
    console.log(`🔔: ${socket.user.email}`);
     const userDetails = await User.findOne({where: { id: socket.id}}) 
     socket.emit('login', userDetails.lastname)
    let room; 

    const outStockProducts = await Products.findAll({where: { 
      quantity: { [Op.lte]: 5 },
      sellerId: socket.id
    }});
    const bonusOnProduct = await Products.findAll({where: { 
      bonus:{ [Op.gt]: 0 },
    }});
    const expiredProducts = await Products.findAll({where: { 
      expiryDate: {
        [Op.lt]: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        [Op.gte]: new Date()
      },
      sellerId: socket.id
    }});

    if (socket.user.role === 'seller') {
      room = socket.user.role;
        socket.join(room);
        const sellerNotifications = await Notifications.findAll({ where: {receiverId: socket.id}});
        notifyNamespace.to(socket.id).emit('newProduct-notification', sellerNotifications);
        notifyNamespace.to(socket.id).emit('outOfStock-notification', outStockProducts);
        notifyNamespace.to(socket.id).emit('expired-notification', expiredProducts);
    } else{
      room = socket.user.role;
      socket.join(room)
      const notifications = await Notifications.findAll({ where: {receiverId: null}});
      notifyNamespace.to('buyer').emit('newProduct-notification', notifications);
      notifyNamespace.to('buyer').emit('productBonus-notification', bonusOnProduct);
    }
  });
const notifyUser = async( subject, message, entityId, receiverId ) => {
      await Notifications.create({
        subject,
        message,
        entityId,
        receiverId,
    });
    
}

  eventEmitter.on('notifySeller', (notificationDetails) =>{
    
    notifyNamespace.to(notificationDetails.receiver).emit('general-notification', notificationDetails.subject, notificationDetails.message );
    notifyUser(notificationDetails.subject, notificationDetails.message, notificationDetails.entityId, notificationDetails.receiverId, notificationDetails.receiverId)
  })
  eventEmitter.on('notifyBuyers', (notificationDetails) =>{
    
    notifyNamespace.to(notificationDetails.receiver).emit('general-notification', notificationDetails.subject, notificationDetails.message );
    notifyUser(notificationDetails.subject, notificationDetails.message, notificationDetails.entityId)
  })
  eventEmitter.on('notifySellers', (notificationDetails) =>{
    
    notifyNamespace.to(notificationDetails.receiver).emit('general-notification', notificationDetails.subject, notificationDetails.message );
    notifyUser(notificationDetails.subject, notificationDetails.message, notificationDetails.entityId, notificationDetails.receiverId)
  })
  eventEmitter.on('notifyBuyer', (notificationDetails) =>{
    
    notifyNamespace.to(notificationDetails.receiver).emit('general-notification', notificationDetails.subject, notificationDetails.message );
    notifyUser(notificationDetails.subject, notificationDetails.message, notificationDetails.entityId, notificationDetails.receiverId)
  })

notifyNamespace.on('notification-view', async (status, id) =>{
 await Notifications.update({is_read: status}, {where: {id}})
})
  return { io, notifyNamespace }
}

export { initializeChat };
