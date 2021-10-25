const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const { SECRET_CODE } = require('../utils/config');
const UnAuthError = require('../errors/unauth-error');
const { MSG_ERR_UNAUTH } = require('../utils/messages');

const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new UnAuthError(MSG_ERR_UNAUTH);
  }
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : SECRET_CODE);
  } catch (err) {
    next(new UnAuthError(MSG_ERR_UNAUTH));
  }

  req.user = payload;
  next();
};

module.exports = auth;
