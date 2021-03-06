require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const bookmarksRouter = require('./bookmarks/bookmarks-router');

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, bookmarks!');
});

/*
const validateBearerToken = (req, res, next) => {
  const token = process.env.API_TOKEN;
  const auth = req.get('Authorization');

  if (!auth || auth.split(' ')[1] !== token)
    return res.status(401).json({ error: 'Unauthorized request' });
  else next();
};

app.use(validateBearerToken);
*/

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.use(bookmarksRouter);

module.exports = app;
