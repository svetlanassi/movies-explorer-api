const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getInfoAboutUser,
  updateUserProfile,
} = require('../controllers/users');

userRouter.get('/users/me', getInfoAboutUser);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUserProfile);

module.exports = userRouter;
