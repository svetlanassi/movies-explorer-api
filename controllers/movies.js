/* eslint-disable linebreak-style */
const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadReqError = require('../errors/bad-req-error');
const { MSG_DELETE_MOVIE } = require('../utils/config');
const {
  MSG_ERR_NOT_FOUND_MOVIE,
  MSG_ERR_FORBIDDEN,
  MSG_ERR_INCORRECT_DATA,
} = require('../utils/messages');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError(MSG_ERR_INCORRECT_DATA));
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(MSG_ERR_NOT_FOUND_MOVIE);
      }
      if (req.user._id !== String(movie.owner)) {
        throw new ForbiddenError(MSG_ERR_FORBIDDEN);
      }
      return movie.remove()
        .then(() => res.status(200).send({ message: MSG_DELETE_MOVIE }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError(MSG_ERR_INCORRECT_DATA));
      }
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
