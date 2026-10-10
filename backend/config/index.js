const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3001,
  SEED_PATH: path.join(__dirname, '..', 'data', 'seed.json')
};
