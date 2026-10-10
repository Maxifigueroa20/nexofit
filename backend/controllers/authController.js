const AuthService = require('../services/authService');

class AuthController {
  static login(req, res) {
    try {
      const { username, password } = req.body;
      const result = AuthService.login(username, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  static getDemoUsers(req, res) {
    try {
      const demoUsers = AuthService.getDemoUsers();
      res.json(demoUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
