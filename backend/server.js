const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');

// Let's debug what's being imported
const models = require('./models');
const { User, Project, File, Message } = models;


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
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

    socket.on('joinProject', ({ projectId }) => {
        const room = `project-${projectId}`;
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on('codeChange', async ({ projectId, fileId, content }) => {
        try {
            await File.update({ content }, { where: { id: fileId, projectId: parseInt(projectId) } });
            const room = `project-${projectId}`;
            socket.to(room).emit('codeUpdate', { fileId, content });
        } catch (error) {
            console.error('Error handling code change:', error);
        }
    });

    socket.on('sendMessage', async ({ projectId, content, userId }) => {
        try {
            const message = await Message.create({
                content,
                projectId: parseInt(projectId),
                userId,
            });

            const user = await User.findByPk(userId, { attributes: ['id', 'name'] });
            const messageData = {
                id: message.id,
                content: message.content,
                createdAt: message.createdAt,
                projectId: message.projectId,
                User: user
            };
            const room = `project-${projectId}`;
            socket.to(room).emit('newMessage', messageData);
        } catch (error) {
            console.error('Error handling send message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

const connectAndSyncDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connection has been established successfully.');
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database or sync models:', error);
    }
};

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectAndSyncDB();
});

