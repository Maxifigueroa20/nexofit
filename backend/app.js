const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.url}` });
});

app.use((err, req, res, next) => {
  console.error('[Error no controlado]', err);
  res.status(500).json({ error: 'Error interno del servidor', detail: err.message });
});

module.exports = app;
