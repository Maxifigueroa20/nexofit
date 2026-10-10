const { getData, reloadSeeds } = require('./database');

class MemberModel {
  static findAll() {
    return getData().members;
  }

  static findById(id) {
    return getData().members.find((m) => m.id === id);
  }

  static findByInstitutionId(institutionId) {
    return getData().members.filter((m) => m.institutionId === institutionId);
  }

  static create(memberData) {
    getData().members.unshift(memberData);
    return memberData;
  }

  static update(id, updates) {
    const member = MemberModel.findById(id);
    if (!member) return null;
    Object.assign(member, updates);
    return member;
  }

  static reset() {
    reloadSeeds();
  }
}

module.exports = MemberModel;
