const express = require('express');
const logger = require('../logger');
const uuid = require('uuid/v4');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

const bookmarks = [
  {
    id: 1,
    name: 'Test',
    description: 'This is a bookmark'
  }
];

const example = {
  name: 'Test2',
  description: 'Also a test'
};

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { name, description } = req.body;

    if (!name) {
      logger.error('Name is required');
      return res.status(400).send('Invalid name');
    }
    if (description.length <= 0) {
      logger.error('Description is required');
      return res.status(400).send('Invalid description');
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
      .json({ id });
  });

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
  
    const { id } = req.params;
    const result = bookmarks.find(b => b.id === id);

    if(!result) {
      logger.error(`Bookmark with id ${id} no found.`)
      return res
        .status(404)
        .send('Bookmark not found')
    }

    res.json(result)
  });
  .delete((req, res) => {
    const { id } = req.params
    const index = bookmarks.findIndex(b => b.id === id)

    if(index === -1) {
      logger.error(`Bookmark with id ${id} not found.`)
      return res
        .status(404)
        .send('Bookmark not found')
    }

    bookmarks.splice(index, 1)

    logger.info(`Bookmark with id ${id} deleted.`)
    res
      .status(204)
      .end()
  })

module.exports = bookmarksRouter;