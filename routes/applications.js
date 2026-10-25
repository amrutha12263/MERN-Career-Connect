const router = require('express').Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { STATUSES } = require('../models/Application');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const wrap = require('../middleware/wrap');
const { notify } = require('../utils');

router.use(protect);

// Student: apply (uses uploaded resume, or the one on their profile)
router.post('/:jobId', authorize('student'), upload.single('resume'), wrap(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job || !job.isActive) return res.status(404).json({ message: 'This job is no longer open' });
  if (job.deadline && job.deadline < new Date()) return res.status(400).json({ message: 'The application deadline has passed' });
  if (req.file) req.user.resume = `/uploads/${req.file.filename}`;
  if (!req.user.resume) return res.status(400).json({ message: 'Upload a resume before applying' });
  await req.user.save();
  if (await Application.findOne({ job: job._id, student: req.user._id }))
    return res.status(409).json({ message: 'You have already applied to this job' });
  const app = await Application.create({ job: job._id, student: req.user._id, resume: req.user.resume, coverLetter: req.body.coverLetter });
  await notify(job.recruiter, `${req.user.name} applied for ${job.title}`, `/recruiter/jobs/${job._id}`);
  res.status(201).json(app);
}));

// Student: my applications
router.get('/mine', authorize('student'), wrap(async (req, res) => {
  res.json(await Application.find({ student: req.user._id }).populate('job').sort('-updatedAt'));
}));

// Recruiter: pipeline summary
router.get('/stats', authorize('recruiter'), wrap(async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id }).select('_id');
  const rows = await Application.aggregate([
    { $match: { job: { $in: jobs.map((j) => j._id) } } },
    { $group: { _id: '$status', n: { $sum: 1 } } },
  ]);
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  rows.forEach((r) => (byStatus[r._id] = r.n));
  res.json({ jobs: jobs.length, total: rows.reduce((a, r) => a + r.n, 0), byStatus });
}));

// Recruiter: applicants for one of their jobs
router.get('/job/:jobId', authorize('recruiter'), wrap(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, recruiter: req.user._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  const applications = await Application.find({ job: job._id }).populate('student', 'name email university skills').sort('-createdAt');
  res.json({ job, applications });
}));

async function ownedApplication(req, res) {
  const app = await Application.findById(req.params.id).populate('job');
  if (!app || String(app.job.recruiter) !== String(req.user._id)) {
    res.status(404).json({ message: 'Application not found' });
    return null;
  }
  return app;
}

// Recruiter: change status
router.put('/:id/status', authorize('recruiter'), wrap(async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const app = await ownedApplication(req, res);
  if (!app) return;
  app.status = status;
  await app.save();
  await notify(app.student, `Your application for ${app.job.title} is now "${status}"`, '/dashboard');
  res.json(app);
}));

// Recruiter: schedule interview
router.put('/:id/interview', authorize('recruiter'), wrap(async (req, res) => {
  const { date, mode, link, notes } = req.body;
  if (!date || new Date(date) < new Date()) return res.status(400).json({ message: 'Choose a future date and time' });
  const app = await ownedApplication(req, res);
  if (!app) return;
  app.interview = { date, mode, link, notes };
  app.status = 'Interview Scheduled';
  await app.save();
  const when = new Date(date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  await notify(app.student, `Interview for ${app.job.title} at ${app.job.company}: ${when} (${mode || 'online'})`, '/dashboard');
  res.json(app);
}));

// Student: withdraw
router.delete('/:id', authorize('student'), wrap(async (req, res) => {
  const app = await Application.findOneAndDelete({ _id: req.params.id, student: req.user._id });
  if (!app) return res.status(404).json({ message: 'Application not found' });
  res.json({ message: 'Application withdrawn' });
}));

module.exports = router;
