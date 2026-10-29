const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const { CLIENT_URL } = require('./config');

const app = express();

const allowedOrigins = CLIENT_URL ? CLIENT_URL.split(',').map((u) => u.trim()) : [];

const corsOptions = {
  origin: (origin, callback) => {
    if (origin && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Acceso denegado: origen no autorizado o CLIENT_URL no configurada'));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', apiRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.url}` });
});

app.use((err, req, res, next) => {
  if (err.message && err.message.includes('Acceso denegado')) {
    return res.status(403).json({ error: err.message });
  }
  console.error('[Error no controlado]', err);
  res.status(500).json({ error: 'Error interno del servidor', detail: err.message });
});

module.exports = app;
