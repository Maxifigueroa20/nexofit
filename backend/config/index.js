const path = require('path');
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3001,
  HOST: process.env.HOST || '0.0.0.0',
  DATABASE_URL: process.env.DATABASE_URL || null,
  CLIENT_URL: process.env.CLIENT_URL || null,
  SEED_PATH: path.join(__dirname, '..', 'data', 'seed.json')
};
