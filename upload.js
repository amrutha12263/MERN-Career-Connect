const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`),
});
const allowed = ['.pdf', '.doc', '.docx'];

module.exports = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    allowed.includes(path.extname(file.originalname).toLowerCase())
      ? cb(null, true)
      : cb(Object.assign(new Error('Resume must be a PDF or Word file'), { status: 400 })),
});
