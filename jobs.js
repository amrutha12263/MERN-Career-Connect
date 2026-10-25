const router = require('express').Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/auth');
const wrap = require('../middleware/wrap');

const csv = (v) => (Array.isArray(v) ? v : String(v || '').split(',')).map((s) => s.trim()).filter(Boolean);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Public: search + filters + pagination
router.get('/', wrap(async (req, res) => {
  const { q, type, mode, location, skills, page = 1, limit = 9 } = req.query;
  const filter = { isActive: true, $or: [{ deadline: null }, { deadline: { $gte: new Date() } }] };
  if (q) filter.$and = [{ $or: ['title', 'company', 'description'].map((f) => ({ [f]: new RegExp(esc(q), 'i') })) }];
  if (type) filter.type = type;
  if (mode) filter.mode = mode;
  if (location) filter.location = new RegExp(esc(location), 'i');
  if (skills) filter.skills = { $in: csv(skills).map((s) => new RegExp(`^${esc(s)}$`, 'i')) };
  const p = Math.max(1, +page), l = Math.min(50, +limit);
  const [jobs, total] = await Promise.all([
    Job.find(filter).sort('-createdAt').skip((p - 1) * l).limit(l),
    Job.countDocuments(filter),
  ]);
  res.json({ jobs, total, pages: Math.ceil(total / l), page: p });
}));

// Recruiter: own jobs with applicant counts
router.get('/mine', protect, authorize('recruiter'), wrap(async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id }).sort('-createdAt').lean();
  const counts = await Application.aggregate([
    { $match: { job: { $in: jobs.map((j) => j._id) } } },
    { $group: { _id: '$job', n: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
  res.json(jobs.map((j) => ({ ...j, applicants: map[String(j._id)] || 0 })));
}));

router.get('/:id', wrap(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
}));

router.post('/', protect, authorize('recruiter'), wrap(async (req, res) => {
  const body = { ...req.body, skills: csv(req.body.skills), recruiter: req.user._id };
  if (!body.deadline) delete body.deadline;
  res.status(201).json(await Job.create(body));
}));

router.put('/:id', protect, authorize('recruiter'), wrap(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, recruiter: req.user._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  const { recruiter, ...rest } = req.body;
  if (rest.skills !== undefined) rest.skills = csv(rest.skills);
  Object.assign(job, rest);
  await job.save();
  res.json(job);
}));

router.delete('/:id', protect, authorize('recruiter'), wrap(async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, recruiter: req.user._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  await Application.deleteMany({ job: job._id });
  res.json({ message: 'Job deleted' });
}));

module.exports = router;
