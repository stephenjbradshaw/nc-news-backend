const articlesRouter = require("express").Router();

const { getArticle } = require("../controllers/articles.controllers");

const { sendError405 } = require("../errors/");

articlesRouter.route("/:article_id").get(getArticle).all(sendError405);

module.exports = articlesRouter;
