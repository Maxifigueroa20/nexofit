const app = require('./app');
const { PORT } = require('./config');

app.listen(PORT, () => {
  console.log(`[NexoFit Backend] Servidor activo en http://localhost:${PORT}`);
  console.log(`[NexoFit Backend] Canales SSE activos en http://localhost:${PORT}/api/events`);
});
