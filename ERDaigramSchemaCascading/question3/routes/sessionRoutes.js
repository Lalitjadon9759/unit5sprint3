const express = require('express');
const router = express.Router();
const {
    getRecentSessions,
    countLearnersForMentor,
    listLearners,
    mentorsWithNoActiveSessions,
    learnersWithMoreThan3Sessions,
    archiveSession
} = require('../controllers/sessionController');

router.get('/recent', getRecentSessions);
router.get('/mentor/:id/learners-count', countLearnersForMentor);
router.get('/:id/learners', listLearners);
router.get('/mentors/no-active-sessions', mentorsWithNoActiveSessions);
router.get('/learners/more-than-3', learnersWithMoreThan3Sessions);
router.put('/:id/archive', archiveSession);

module.exports = router;
