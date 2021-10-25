/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const { MSG_ERR_INCORRECT_EMAIL } = require('../utils/messages');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: MSG_ERR_INCORRECT_EMAIL,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
