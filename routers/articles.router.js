const articlesRouter = require("express").Router();

const {
  getArticle,
  patchArticle,
  getComments,
  postComment,
} = require("../controllers/articles.controllers");

const { handle405s } = require("../errors/");

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment)
  .all(handle405s);
module.exports = articlesRouter;
