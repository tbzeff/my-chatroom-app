import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' }
});

let chatHistory = []; // <-- In-memory store

io.on('connection', socket => {
  console.log('a user connected');

  // Send history to new user
  socket.emit('chat history', chatHistory)

  socket.on('chat message', msg => {
    chatHistory.push(msg); // Store message
    if (chatHistory.length > 100) chatHistory.shift(); // Remove oldest to avoid memory bloat
    io.emit('chat message', msg);
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing');
  });
});

httpServer.listen(3002, () => {
  console.log('Socket.io server listening on http://localhost:3002');
});
