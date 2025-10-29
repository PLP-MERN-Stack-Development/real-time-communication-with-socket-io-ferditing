// socket server bootstrap
const { Server } = require('socket.io');
const { registerSocketHandlers } = require('../controllers/socketController');

function createSocketServer(httpServer, options = {}) {
  const io = new Server(httpServer, options);

  io.on('connection', (socket) => {
    registerSocketHandlers(io, socket);
  });

  return io;
}

module.exports = { createSocketServer };
