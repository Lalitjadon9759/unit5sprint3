const Mentor = require('../models/Mentor');
const Session = require('../models/Session');

// Soft delete mentor and disable upcoming sessions
const deleteMentor = async (req, res) => {
    try {
        const mentorId = req.params.id;
        await Mentor.findByIdAndUpdate(mentorId, { isActive: false });

        await Session.updateMany(
            { mentor: mentorId, time: { $gt: new Date() } },
            { isActive: false }
        );

        res.status(200).json({ message: 'Mentor soft deleted and upcoming sessions disabled.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Find all active sessions for a mentor
const getActiveSessions = async (req, res) => {
    try {
        const mentorId = req.params.id;
        const sessions = await Session.find({
            mentor: mentorId,
            isActive: true,
            isArchived: false
        }).populate('learners.learner', 'name').sort({ time: -1 });

        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { deleteMentor, getActiveSessions };
