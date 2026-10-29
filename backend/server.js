const app = require('./app');
const { PORT, HOST } = require('./config');
const { initDatabase } = require('./models/database');

async function start() {
  await initDatabase();
  app.listen(PORT, HOST, () => {
    console.log(`[NexoFit Backend] Servidor activo en http://${HOST}:${PORT}`);
    console.log(`[NexoFit Backend] Canales SSE activos en http://${HOST}:${PORT}/api/events`);
  });
}

start().catch((err) => {
  console.error('[NexoFit Backend Startup Error]', err);
  process.exit(1);
});
