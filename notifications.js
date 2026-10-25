const router = require('express').Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');
const wrap = require('../middleware/wrap');

router.use(protect);
router.get('/', wrap(async (req, res) => {
  const items = await Notification.find({ user: req.user._id }).sort('-createdAt').limit(30);
  res.json({ items, unread: items.filter((n) => !n.read).length });
}));
router.put('/read-all', wrap(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ ok: true });
}));
router.put('/:id/read', wrap(async (req, res) => {
  await Notification.updateOne({ _id: req.params.id, user: req.user._id }, { read: true });
  res.json({ ok: true });
}));
module.exports = router;
