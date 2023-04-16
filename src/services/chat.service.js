import { Server } from 'socket.io';
import { findUserById } from './user.service';
import { Chat, User } from '../database/models';

function initializeChat(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
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

  return io;
}

export { initializeChat };