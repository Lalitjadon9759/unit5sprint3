const express = require('express');
const router = express.Router();
const { deleteMentor, getActiveSessions } = require('../controllers/mentorController');

router.put('/:id/delete', deleteMentor);
router.get('/:id/active-sessions', getActiveSessions);

module.exports = router;
