const express = require('express');
const logger = require('../logger');
const uuid = require('uuid/v4');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

const bookmarks = [{
  id: 1,
  name: 'Test',
  description: 'This is a bookmark'
}];

const example = {
  name: 'Test2',
  description: 'Also a test'
};

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res
      .json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { name, description } = req.body;

    console.log(req.body)
    console.log(name)
    console.log(description)
    if(!name) {
      logger.error('Name is required');
      return res
        .status(400)
        .send('Invalid name');
    }
    if(description.length <= 0) {
      logger.error('Description is required');
      return res
        .status(400)
        .send('Invalid description');
    }

    const id = uuid();
    const bookmark = {
      id,
      name,
      description
    };
    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json({id});
  });

module.exports = bookmarksRouter;