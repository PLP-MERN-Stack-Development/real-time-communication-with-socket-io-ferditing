const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { createSocketServer } = require('./socket');
const { listMessages } = require('./models/messages');
const { listUsers } = require('./models/users');
const config = require('./config');

const app = express();
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
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
    origin: config.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = config.PORT;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = { app, server, io };
