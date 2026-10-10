const { Router } = require('express');
const SseController = require('../controllers/sseController');

const router = Router();

router.get('/', SseController.subscribe);

module.exports = router;
