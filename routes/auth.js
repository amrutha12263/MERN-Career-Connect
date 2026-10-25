const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const wrap = require('../middleware/wrap');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const csv = (v) => (Array.isArray(v) ? v : String(v || '').split(',')).map((s) => s.trim()).filter(Boolean);

router.post('/register', wrap(async (req, res) => {
  const { name, email, password, role, university, company } = req.body;
  if (!['student', 'recruiter'].includes(role)) return res.status(400).json({ message: 'Choose student or recruiter' });
  if (role === 'recruiter' && !company) return res.status(400).json({ message: 'Company name is required for recruiters' });
  if (await User.findOne({ email })) return res.status(409).json({ message: 'Email is already registered' });
  const user = await User.create({ name, email, password, role, university, company });
  res.status(201).json({ token: sign(user._id), user: await User.findById(user._id) });
}));

router.post('/login', wrap(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Incorrect email or password' });
  res.json({ token: sign(user._id), user: await User.findById(user._id) });
}));

router.get('/me', protect, (req, res) => res.json(req.user));

router.put('/profile', protect, upload.single('resume'), wrap(async (req, res) => {
  const { name, university, company, skills } = req.body;
  if (name) req.user.name = name;
  if (university !== undefined) req.user.university = university;
  if (company !== undefined && req.user.role === 'recruiter') req.user.company = company;
  if (skills !== undefined) req.user.skills = csv(skills);
  if (req.file) req.user.resume = `/uploads/${req.file.filename}`;
  await req.user.save();
  res.json(req.user);
}));

module.exports = router;
