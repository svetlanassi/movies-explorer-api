/* eslint-disable linebreak-style */
const SECRET_CODE = 'some-secret-key';

const ALLOWED_CORS = [
  'https://save.movies.nomoredomains.monster',
  'http://save.movies.nomoredomains.monster',
  'http://localhost:3000',
  'http://localhost:3001',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  SECRET_CODE,
  ALLOWED_CORS,
  DEFAULT_ALLOWED_METHODS,
};
