const { Router } = require('express');
const institutionRoutes = require('./institutionRoutes');
const memberRoutes = require('./memberRoutes');
const eventRoutes = require('./eventRoutes');
const authRoutes = require('./authRoutes');
const MemberController = require('../controllers/memberController');
const SseService = require('../services/sseService');

const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'NexoFit Express API (MVC Layered)',
    uptime: process.uptime(),
    activeSseClients: SseService.getClientCount()
  });
});

apiRouter.post('/reset-seeds', MemberController.resetSeeds);

apiRouter.use('/auth', authRoutes);
apiRouter.use('/institutions', institutionRoutes);
apiRouter.use('/members', memberRoutes);
apiRouter.use('/events', eventRoutes);

module.exports = apiRouter;
