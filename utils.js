const Notification = require('./models/Notification');
exports.notify = (user, message, link) => Notification.create({ user, message, link });
