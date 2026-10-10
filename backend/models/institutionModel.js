const { getData } = require('./database');

class InstitutionModel {
  static findAll() {
    return getData().institutions;
  }

  static findById(id) {
    return getData().institutions.find((i) => i.id === id);
  }
}

module.exports = InstitutionModel;
