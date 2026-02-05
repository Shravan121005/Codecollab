const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Create a new Sequelize instance to connect to the database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
  }
);

const connectWithRetry = async () => {
  let retries = 10;

  while (retries) {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connected successfully');
      await sequelize.sync();
      console.log('✅ Models synced');
      break;
    } catch (err) {
      console.log('❌ DB connection failed. Retrying in 5 sec...', err.message);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

connectWithRetry();

module.exports = sequelize;
