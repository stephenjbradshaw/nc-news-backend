const topicsRouter = require("express").Router();

const {
  getTopics,
  getTopicBySlug,
} = require("../controllers/topics.controllers");

const { handle405s } = require("../errors/");

topicsRouter.route("/").get(getTopics).all(handle405s);

topicsRouter.route("/:slug").get(getTopicBySlug).all(handle405s);

module.exports = topicsRouter;
