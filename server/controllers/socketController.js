// central socket event handlers
const { addUser, removeUser, getUser, listUsers } = require('../models/users');
const { addMessage } = require('../models/messages');
const logger = require('../utils/logger');

function registerSocketHandlers(io, socket) {
  logger.info(`Connected: ${socket.id}`);

  socket.on('user_join', (username) => {
    if (!username) return;
    addUser(socket.id, username);
    io.emit('user_list', listUsers());
    io.emit('user_joined', { username, id: socket.id });
    logger.info(`${username} joined (${socket.id})`);
  });

  socket.on('send_message', (messageData) => {
    const sender = getUser(socket.id)?.username || 'Anonymous';
    const msg = {
      id: Date.now(),
      sender,
      senderId: socket.id,
      message: messageData?.message ?? '',
      timestamp: new Date().toISOString(),
      isPrivate: !!messageData?.isPrivate,
    };
    addMessage(msg);

    if (msg.isPrivate && messageData.to) {
      socket.to(messageData.to).emit('private_message', msg);
      socket.emit('private_message', msg);
    } else {
      io.emit('receive_message', msg);
    }
  });

  socket.on('typing', (isTyping) => {
    const user = getUser(socket.id);
    if (!user) return;
    // Keep a transient typing state via each socket emitting list
    // For simplicity broadcast user + typing flag; clients manage their own typing collection
    io.emit('typing', { id: socket.id, username: user.username, isTyping: !!isTyping });
  });

  socket.on('private_message', ({ to, message }) => {
    if (!to || !message) return;
    const sender = getUser(socket.id)?.username || 'Anonymous';
    const msg = {
      id: Date.now(),
      sender,
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
    };
    socket.to(to).emit('private_message', msg);
    socket.emit('private_message', msg);
  });

  socket.on('disconnect', () => {
    const user = getUser(socket.id);
    if (user) {
      io.emit('user_left', { username: user.username, id: socket.id });
      logger.info(`${user.username} disconnected (${socket.id})`);
    } else {
      logger.info(`Socket disconnected: ${socket.id}`);
    }
    removeUser(socket.id);
    io.emit('user_list', listUsers());
  });
}

module.exports = { registerSocketHandlers };
