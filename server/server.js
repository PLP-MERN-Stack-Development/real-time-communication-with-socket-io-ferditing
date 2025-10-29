// server.js - updated CORS handling to allow both development and production origins
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { createSocketServer } = require('./socket');
const { listMessages } = require('./models/messages');
const { listUsers } = require('./models/users');
const config = require('./config');

const app = express();

// Build allowed origins list from config + common dev hosts
const ALLOWED_ORIGINS = [
  config.CLIENT_URL,           // production client (Netlify)
  'http://localhost:5173',     // Vite default
  'http://localhost:3000',     // alternative dev port (optional)
].filter(Boolean);

// CORS middleware that dynamically allows only accepted origins
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser requests like curl/postman (no origin)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS policy: origin ${origin} not allowed`), false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// basic API
app.get('/api/messages', (req, res) => {
  res.json(listMessages());
});

app.get('/api/users', (req, res) => {
  res.json(listUsers());
});

app.get('/', (req, res) => res.send('Socket.io Chat Server (modular)'));

// start server and socket
const server = http.createServer(app);

const io = createSocketServer(server, {
  cors: {
    origin: function (origin, callback) {
      // Socket.IO may send no origin for non-browser clients
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error(`Socket CORS: origin ${origin} not allowed`), false);
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = config.PORT || process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});

module.exports = { app, server, io };
