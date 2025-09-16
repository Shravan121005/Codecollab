// Import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');
const { User, Project } = require('./models'); // Import models to sync

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection & Sync ---
const connectAndSyncDB = async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('PostgreSQL connection has been established successfully.');

    // Sync all defined models to the DB.
    // { alter: true } will check the current state of the table in the database and then perform the necessary changes to make it match the model.
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (err) {
    console.error('Unable to connect to the database or sync models:', err);
    process.exit(1);
  }
};
connectAndSyncDB();

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('CodeCollab API is running...');
});

// Use the authentication routes
app.use('/api/auth', require('./routes/auth'));
// Use the project routes
app.use('/api/projects', require('./routes/projects'));

// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

