const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
    learners: [{
        learner: { type: mongoose.Schema.Types.ObjectId, ref: 'Learner' },
        attendanceStatus: { type: String, enum: ['attended', 'cancelled'], default: 'attended' },
        feedback: String
    }],
    topic: { type: String, required: true },
    time: { type: Date, required: true },
    notes: String,
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
