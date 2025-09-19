const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');
const { File } = require('./models'); // Ensure File is destructured

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Your React app's URL
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));

app.get('/', (req, res) => {
    res.send('CodeCollab API is running...');
});

// Real-time communication with Socket.io
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a project-specific room
    socket.on('joinProject', ({ projectId }) => {
        const room = `project-${projectId}`;
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    // Handle code changes
    socket.on('codeChange', async ({ projectId, fileId, content }) => {
        try {
            // THE FIX: Convert projectId string to an integer for the database query
            const numericProjectId = parseInt(projectId, 10);

            // Save the change to the database using the correct data type
            await File.update({ content }, { where: { id: fileId, projectId: numericProjectId } });

            // Broadcast the change to other clients in the same project room
            const room = `project-${projectId}`;
            socket.to(room).emit('codeUpdate', { fileId, content });
        } catch (error){
            console.error('Error handling code change:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

const connectAndSyncDB = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('PostgreSQL connection has been established successfully.');
        await db.sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database or sync models:', error);
    }
};

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectAndSyncDB();
});

