/* eslint-disable linebreak-style */
const { MSG_ERR_SERVER } = require('../utils/messages');

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? MSG_ERR_SERVER
      : message,
  });
  next();
};

module.exports = errorHandler;
