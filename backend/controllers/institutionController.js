const InstitutionService = require('../services/institutionService');
const MemberService = require('../services/memberService');

class InstitutionController {
  static async getAll(req, res) {
    try {
      const institutions = await InstitutionService.getAllWithStats();
      res.json(institutions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const institution = await InstitutionService.getById(req.params.id);
      if (!institution) {
        return res.status(404).json({ error: 'Institución no encontrada' });
      }
      res.json(institution);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMembers(req, res) {
    try {
      const members = await MemberService.getMembersByInstitution(req.params.id, req.query);
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async enrollMember(req, res) {
    try {
      const member = await MemberService.enrollMember(req.params.id, req.body);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async togglePremium(req, res) {
    try {
      const updated = await InstitutionService.togglePremium(req.params.id);
      res.json(updated);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = InstitutionController;
