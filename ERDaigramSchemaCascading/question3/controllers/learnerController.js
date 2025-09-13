const Learner = require('../models/Learner');
const Session = require('../models/Session');

// Soft delete learner and mark attendance cancelled
const deleteLearner = async (req, res) => {
    try {
        const learnerId = req.params.id;
        await Learner.findByIdAndUpdate(learnerId, { isActive: false });

        await Session.updateMany(
            { 'learners.learner': learnerId, time: { $gt: new Date() } },
            { $set: { 'learners.$.attendanceStatus': 'cancelled' } }
        );

        res.status(200).json({ message: 'Learner soft deleted and attendance cancelled.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// List all mentors a learner has interacted with
const getMentorsForLearner = async (req, res) => {
    try {
        const learnerId = req.params.id;

        const sessions = await Session.find({
            'learners.learner': learnerId,
            isArchived: false
        }).populate('mentor', 'name');

        const mentorSet = new Set(sessions.map(s => s.mentor._id.toString()));
        const mentors = sessions.map(s => s.mentor).filter((m, index, self) =>
            index === self.findIndex((t) => t._id.toString() === m._id.toString())
        );

        res.json(mentors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { deleteLearner, getMentorsForLearner };
