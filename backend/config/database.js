const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

let sequelize;

// for prod use to connect to render postgres

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} 
// Fallback for local docker-compose
else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
    }
  );
}

// for local use to connect to db container
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
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