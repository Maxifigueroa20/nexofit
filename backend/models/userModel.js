const { getData } = require('./database');

class UserModel {
  static findAll() {
    return getData().users || [];
  }

  static findByUsername(username) {
    const users = getData().users || [];
    return users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  static findById(id) {
    const users = getData().users || [];
    return users.find((u) => u.id === id);
  }
}

module.exports = UserModel;
