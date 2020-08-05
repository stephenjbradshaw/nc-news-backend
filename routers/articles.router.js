const articlesRouter = require("express").Router();

const { getArticle } = require("../controllers/articles.controllers");

const { handle405s } = require("../errors/");

articlesRouter.route("/:article_id").get(getArticle).all(handle405s);

module.exports = articlesRouter;
