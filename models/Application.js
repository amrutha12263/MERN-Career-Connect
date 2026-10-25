const mongoose = require('mongoose');

const STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: String, required: true },
  coverLetter: String,
  status: { type: String, enum: STATUSES, default: 'Applied' },
  interview: { date: Date, mode: String, link: String, notes: String },
}, { timestamps: true });

applicationSchema.index({ job: 1, student: 1 }, { unique: true });
module.exports = mongoose.model('Application', applicationSchema);
module.exports.STATUSES = STATUSES;
