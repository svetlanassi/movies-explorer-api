const validator = require('validator');
const BadReqError = require('../errors/bad-req-error');
const { MSG_ERR_INCORRECT_URL } = require('../utils/messages');

const urlValidate = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new BadReqError(MSG_ERR_INCORRECT_URL);
};

module.exports = urlValidate;
