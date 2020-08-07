const articlesRouter = require("express").Router();

const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles.controllers");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments.controllers");

const { handle405s } = require("../errors/");

articlesRouter.route("/").get(getArticles).all(handle405s);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(handle405s);
module.exports = articlesRouter;
