/* eslint-disable linebreak-style */
/* eslint-disable spaced-comment */
const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/not-found-error');
const BadReqError = require('../errors/bad-req-error');
const ConflictError = require('../errors/conflict-error');
const UnAuthError = require('../errors/unauth-error');
const SECRET_CODE = require('../utils/config');
const {
  MSG_ERR_NOT_FOUND_USER,
  MSG_ERR_INCORRECT_DATA,
  MSG_ERR_CONFLICT,
  MSG_ERR_AUTH,
  MSG_SUCCESSFUL_AUTH,
  MSG_DELETE_TOKEN,
} = require('../utils/messages');

const signUp = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          if (!user) {
            throw new BadReqError(MSG_ERR_INCORRECT_DATA);
          }
          return res.status(200).send({ name, email });
        })
        .catch((err) => {
          if (err.name === 'MongoServerError' && err.code === 11000) {
            next(new ConflictError(MSG_ERR_CONFLICT));
          }
          if (err.name === 'ValidationError') {
            next(new BadReqError(MSG_ERR_INCORRECT_DATA));
          }
          next(err);
        });
    });
};

const signIn = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnAuthError(MSG_ERR_AUTH);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnAuthError(MSG_ERR_AUTH);
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : SECRET_CODE, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24,
        httpOnly: true,
      })
        .status(200).send({ message: MSG_SUCCESSFUL_AUTH });
    })
    .catch((err) => next(err));
};

const signOut = (req, res) => {
  res.clearCookie('jwt').status(200).send({ message: MSG_DELETE_TOKEN });
};

const getInfoAboutUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MSG_ERR_NOT_FOUND_USER);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError(MSG_ERR_INCORRECT_DATA));
      }
      next(err);
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, email },
    {
      new: true,
      runValidators: true,
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MSG_ERR_NOT_FOUND_USER);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError(MSG_ERR_INCORRECT_DATA));
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError(MSG_ERR_CONFLICT));
      }
      next(err);
    });
};

module.exports = {
  signUp,
  signIn,
  signOut,
  getInfoAboutUser,
  updateUserProfile,
};
