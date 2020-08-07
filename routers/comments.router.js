const commentsRouter = require("express").Router();

const {
  getCommentById,
  patchCommentById,
  deleteCommentById,
} = require("../controllers/comments.controllers");

const { handle405s } = require("../errors/");

commentsRouter
  .route("/:comment_id")
  .get(getCommentById)
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(handle405s);

module.exports = commentsRouter;
