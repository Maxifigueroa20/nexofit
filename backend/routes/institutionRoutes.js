const { Router } = require('express');
const InstitutionController = require('../controllers/institutionController');

const router = Router();

router.get('/', InstitutionController.getAll);
router.get('/:id', InstitutionController.getById);
router.get('/:id/members', InstitutionController.getMembers);
router.post('/:id/members', InstitutionController.enrollMember);

module.exports = router;
