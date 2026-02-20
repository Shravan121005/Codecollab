const express = require('express');
const cors = require('cors');
require('dotenv').config();

const allowedOrigins = [
  "http://localhost:3000",
  "https://codecollab-frontend-q2wp.onrender.com"
];

const app = express();

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "x-auth-token"]
}));

app.options("*", cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use("/", require("./routes/health"));

app.get('/', (req, res) => {
    res.send('CodeCollab API is running...');
});

module.exports = app;