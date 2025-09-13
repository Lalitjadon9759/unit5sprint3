const express = require('express');
const router = express.Router();
const { deleteLearner, getMentorsForLearner } = require('../controllers/learnerController');

router.put('/:id/delete', deleteLearner);
router.get('/:id/mentors', getMentorsForLearner);

module.exports = router;
