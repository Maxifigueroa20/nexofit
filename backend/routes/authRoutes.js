const { Router } = require('express');
const AuthController = require('../controllers/authController');

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/demo-users', AuthController.getDemoUsers);

module.exports = router;
