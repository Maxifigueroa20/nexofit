const MemberService = require('../services/memberService');

class MemberController {
  static togglePayment(req, res) {
    try {
      const updated = MemberService.togglePaymentStatus(req.params.id);
      res.json(updated);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static recordAttendance(req, res) {
    try {
      const updated = MemberService.recordAttendance(req.params.id);
      res.json(updated);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static getByDni(req, res) {
    try {
      const members = MemberService.getMembersByDni(req.params.dni);
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static resetSeeds(req, res) {
    MemberService.resetDatabase();
    res.json({ message: 'Seeds restablecidos exitosamente a su estado inicial.' });
  }
}

module.exports = MemberController;
