const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  company: { type: String, required: [true, 'Company is required'], trim: true },
  location: { type: String, required: [true, 'Location is required'] },
  type: { type: String, enum: ['Internship', 'Full-time', 'Part-time'], default: 'Internship' },
  mode: { type: String, enum: ['On-site', 'Remote', 'Hybrid'], default: 'On-site' },
  salary: String,
  skills: [String],
  description: { type: String, required: [true, 'Description is required'] },
  deadline: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

jobSchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' });
module.exports = mongoose.model('Job', jobSchema);
