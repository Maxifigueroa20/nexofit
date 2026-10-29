const InstitutionModel = require('../models/institutionModel');
const MemberModel = require('../models/memberModel');
const SseService = require('./sseService');

class InstitutionService {
  static async getAllWithStats() {
    const institutions = await InstitutionModel.findAll();
    const mapped = await Promise.all(
      institutions.map(async (inst) => {
        const members = await MemberModel.findByInstitutionId(inst.id);
        const nexoFitCount = members.filter((m) => m.source?.includes('NexoFit')).length;
        const upToDateCount = members.filter((m) => m.paymentStatus === 'Al día').length;

        return {
          ...inst,
          stats: {
            totalMembers: members.length,
            nexoFitConverted: nexoFitCount,
            upToDateMembers: upToDateCount
          }
        };
      })
    );

    return mapped.sort((a, b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0));
  }

  static async getById(id) {
    return InstitutionModel.findById(id);
  }

  static async togglePremium(id) {
    const inst = await InstitutionModel.findById(id);
    if (!inst) {
      throw new Error('Institución no encontrada');
    }
    const updated = await InstitutionModel.updatePremium(id, !inst.isPremium);
    SseService.broadcast('INSTITUTION_UPDATED', { institution: updated });
    return updated;
  }
}

module.exports = InstitutionService;
