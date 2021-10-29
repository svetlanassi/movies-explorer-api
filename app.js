require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const indexRouter = require('./routes/index');
const errorHandler = require('./middlewares/error');
const limiter = require('./middlewares/limiter');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.use(helmet());
app.use(cors);
app.use(requestLogger);
app.use(limiter);

app.use(express.json());
app.use(cookieParser());

app.use(indexRouter);

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

app.listen(PORT);
