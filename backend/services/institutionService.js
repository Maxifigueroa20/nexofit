const InstitutionModel = require('../models/institutionModel');
const MemberModel = require('../models/memberModel');

class InstitutionService {
  static getAllWithStats() {
    const institutions = InstitutionModel.findAll();
    return institutions.map((inst) => {
      const members = MemberModel.findByInstitutionId(inst.id);
      const nexoFitCount = members.filter((m) => m.source.includes('NexoFit')).length;
      const upToDateCount = members.filter((m) => m.paymentStatus === 'Al día').length;

      return {
        ...inst,
        stats: {
          totalMembers: members.length,
          nexoFitConverted: nexoFitCount,
          upToDateMembers: upToDateCount
        }
      };
    });
  }

  static getById(id) {
    return InstitutionModel.findById(id);
  }
}

module.exports = InstitutionService;
