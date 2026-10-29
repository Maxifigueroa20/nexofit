const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const apiRoutes = require('./routes');
const { CLIENT_URL } = require('./config');

const app = express();

const allowedOrigins = CLIENT_URL ? CLIENT_URL.split(',').map((u) => u.trim()) : [];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Acceso no permitido por política CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', apiRoutes);

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use((req, res, next) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.url}` });
});

app.use((err, req, res, next) => {
  console.error('[Error no controlado]', err);
  res.status(500).json({ error: 'Error interno del servidor', detail: err.message });
});

module.exports = app;
