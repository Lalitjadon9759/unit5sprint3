const Session = require('../models/Session');
const getRecentSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ isActive: true, isArchived: false })
            .sort({ time: -1 })
            .limit(5)
            .populate('mentor', 'name')
            .populate('learners.learner', 'name');
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const countLearnersForMentor = async (req, res) => {
    try {
        const mentorId = req.params.id;
        const sessions = await Session.find({
            mentor: mentorId,
            isActive: true,
            isArchived: false
        });

        const learnerIds = new Set();
        sessions.forEach(session => {
            session.learners.forEach(l => learnerIds.add(l.learner.toString()));
        });

        res.json({ count: learnerIds.size });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const listLearners = async (req, res) => {
    try {
        const sessionId = req.params.id;
        const session = await Session.findById(sessionId)
            .populate('learners.learner', 'name');

        res.json(session.learners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const mentorsWithNoActiveSessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            isActive: true,
            isArchived: false
        }).distinct('mentor');

        const Mentor = require('../models/Mentor');
        const mentors = await Mentor.find({
            _id: { $nin: sessions },
            isActive: true
        });

        res.json(mentors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const learnersWithMoreThan3Sessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            isActive: true,
            isArchived: false
        });

        const attendanceMap = new Map();

        sessions.forEach(session => {
            session.learners.forEach(l => {
                if (l.attendanceStatus === 'attended') {
                    const id = l.learner.toString();
                    attendanceMap.set(id, (attendanceMap.get(id) || 0) + 1);
                }
            });
        });

        const learnerIds = [...attendanceMap.entries()]
            .filter(([id, count]) => count > 3)
            .map(([id]) => id);

        const Learner = require('../models/Learner');
        const learners = await Learner.find({
            _id: { $in: learnerIds },
            isActive: true
        });

        res.json(learners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const archiveSession = async (req, res) => {
    try {
        const sessionId = req.params.id;
        await Session.findByIdAndUpdate(sessionId, { isArchived: true });
        res.json({ message: 'Session archived successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getRecentSessions,
    countLearnersForMentor,
    listLearners,
    mentorsWithNoActiveSessions,
    learnersWithMoreThan3Sessions,
    archiveSession
};
