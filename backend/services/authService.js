const UserModel = require('../models/userModel');
const InstitutionModel = require('../models/institutionModel');

class AuthService {
  static login(username, password) {
    if (!username || !password) {
      throw new Error('Debe proporcionar usuario y contraseña.');
    }

    const user = UserModel.findByUsername(username.trim());
    if (!user || user.password !== password) {
      throw new Error('Credenciales inválidas. Verifique usuario o contraseña.');
    }

    let institution = null;
    if (user.role === 'OWNER' && user.institutionId) {
      institution = InstitutionModel.findById(user.institutionId);
    }

    const { password: _, ...userSafe } = user;
    return {
      user: userSafe,
      institution
    };
  }

  static getDemoUsers() {
    const users = UserModel.findAll();
    return users.map((u) => {
      let inst = null;
      if (u.role === 'OWNER' && u.institutionId) {
        inst = InstitutionModel.findById(u.institutionId);
      }
      return {
        id: u.id,
        username: u.username,
        name: u.name,
        role: u.role,
        institutionId: u.institutionId,
        institutionName: inst ? inst.name : null,
        hintPassword: 'password123'
      };
    });
  }
}

module.exports = AuthService;
