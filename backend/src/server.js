require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Storage mode is selected via STORAGE_DRIVER env (default: json)
const driver = process.env.STORAGE_DRIVER || 'json';

async function start() {
  if (driver !== 'json') {
    const connectDB = require('./config/db');
    await connectDB();
  } else {
    logger.info('Using JSON development storage (backend/data). MongoDB disabled.');
  }
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}

start().catch((err) => {
  logger.error(err);
  process.exit(1);
});