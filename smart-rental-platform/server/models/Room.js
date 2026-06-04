const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the frontend HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Socket.io Real-Time Logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Event: User requests to join a specific room
    socket.on('join_room', (roomName) => {
        socket.join(roomName);
        console.log(`User ${socket.id} joined room: ${roomName}`);
        
        // Notify others in the room
        socket.to(roomName).emit('message', `System: A new user has joined the room.`);
    });

    // Event: User sends a message to a specific room
    socket.on('send_message', (data) => {
        // data object format: { room: "room1", message: "Hello!" }
        io.to(data.room).emit('message', `${socket.id.substring(0, 5)}: ${data.message}`);
    });

    // Event: User disconnects
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running smoothly on http://localhost:${PORT}`);
});
