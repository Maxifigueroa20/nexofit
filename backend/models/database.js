const fs = require('fs');
const { SEED_PATH } = require('../config');

let data = {
  institutions: [],
  members: []
};

function loadSeeds() {
  try {
    const raw = fs.readFileSync(SEED_PATH, 'utf8');
    data = JSON.parse(raw);
    console.log('[DB] Seeds cargados con éxito.');
  } catch (error) {
    console.error('[DB Error] No se pudo leer el archivo de seeds:', error);
  }
}

loadSeeds();

module.exports = {
  getData: () => data,
  reloadSeeds: () => loadSeeds()
};
