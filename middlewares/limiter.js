const rateLimit = require('express-rate-limit');
const { MSG_LIMITER } = require('../utils/messages');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: MSG_LIMITER,
});

module.exports = limiter;
