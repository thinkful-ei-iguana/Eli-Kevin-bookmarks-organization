const express = require("express");
const logger = require("../logger");
const uuid = require("uuid/v4");

const bookmarksRouter = express.Router();
const bodyParser = express.json();

const bookmarks = [
  {
    id: 1,
    name: "Test",
    description: "This is a bookmark"
  }
];

const example = {
  name: "Test2",
  description: "Also a test"
};

bookmarksRouter
  .route("/bookmarks")
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { name, description } = req.body;

    if (!name) {
      logger.error("Name is required");
      return res.status(400).send("Invalid name");
    }
    if (description.length <= 0) {
      logger.error("Description is required");
      return res.status(400).send("Invalid description");
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

bookmarksRouter.route("/bookmarks/:id").get((req, res) => {
  const { id } = req.params;

  return bookmarks[id]
    ? res.json(bookmarks[id])
    : res.status(404).send("invalid id");
});

bookmarksRouter.route("/bookmarks/:id").delete((req, res) => {
  const { id } = req.params;

  bookmarks.splice(bookmarks.findIndex(b => b.id == id), 1);

  res.send(204).end();
});

module.exports = bookmarksRouter;
