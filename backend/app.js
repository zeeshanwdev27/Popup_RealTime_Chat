// app.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle visitor sending a message
  socket.on('visitor_message', ({ id, message }) => {
    console.log(`Visitor ${id} sent: ${message}`);

    // Ensure visitor joins their own room
    socket.join(id);

    // Send this message to all dashboard agents
    io.emit('visitor_message', {
      id,
      message,
      name: 'Visitor',
    });

    // Also emit to the specific room for any agent who joined this visitor
    io.to(id).emit(`chat:${id}`, {
      message,
      from: 'visitor', // ✅ This line is crucial!
    });

  });

  // Handle agent joining a visitor's room
  socket.on('join_room', (roomId) => {
    console.log(`Agent ${socket.id} joined room: ${roomId}`);
    socket.join(roomId);
  });

  // Handle agent sending a message
  socket.on('agent_message', ({ to, message }) => {
    console.log(`Agent sent to ${to}: ${message}`);

    // Emit message to the specific visitor
    io.to(to).emit(`chat:${to}`, {
      message,
      from: 'agent',
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
