import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' }
});

io.on('connection', socket => {
  console.log('a user connected');

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing');
  });
});

httpServer.listen(3002, () => {
  console.log('Socket.io server listening on http://localhost:3002');
});
