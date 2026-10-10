const { Router } = require('express');
const MemberController = require('../controllers/memberController');

const router = Router();

router.get('/by-dni/:dni', MemberController.getByDni);
router.patch('/:id/toggle-payment', MemberController.togglePayment);
router.post('/:id/attendance', MemberController.recordAttendance);

module.exports = router;
