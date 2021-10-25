/* eslint-disable linebreak-style */
const indexRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { signUp, signIn, signOut } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');
const { MSG_ERR_NOT_FOUND_PAGE } = require('../utils/messages');

indexRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), signIn);

indexRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), signUp);

indexRouter.use(auth);

indexRouter.post('/signout', signOut);
indexRouter.use('/', userRouter);
indexRouter.use('/', movieRouter);

indexRouter.use('*', (req, res, next) => {
  next(new NotFoundError(MSG_ERR_NOT_FOUND_PAGE));
});

module.exports = indexRouter;
