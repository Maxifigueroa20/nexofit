const InstitutionService = require('../services/institutionService');
const MemberService = require('../services/memberService');

class InstitutionController {
  static getAll(req, res) {
    try {
      const institutions = InstitutionService.getAllWithStats();
      res.json(institutions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static getById(req, res) {
    try {
      const institution = InstitutionService.getById(req.params.id);
      if (!institution) {
        return res.status(404).json({ error: 'Institución no encontrada' });
      }
      res.json(institution);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static getMembers(req, res) {
    try {
      const members = MemberService.getMembersByInstitution(req.params.id, req.query);
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static enrollMember(req, res) {
    try {
      const member = MemberService.enrollMember(req.params.id, req.body);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = InstitutionController;
