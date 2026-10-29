const MemberService = require('../services/memberService');

class MemberController {
  static async togglePayment(req, res) {
    try {
      const updated = await MemberService.togglePaymentStatus(req.params.id);
      res.json(updated);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async recordAttendance(req, res) {
    try {
      const updated = await MemberService.recordAttendance(req.params.id);
      res.json(updated);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getByDni(req, res) {
    try {
      const members = await MemberService.getMembersByDni(req.params.dni);
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async resetSeeds(req, res) {
    try {
      await MemberService.resetDatabase();
      res.json({ message: 'Seeds restablecidos exitosamente a su estado inicial.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MemberController;
