const topicsRouter = require("express").Router();

const { getTopics } = require("../controllers/topics.controllers");

const { sendError405 } = require("../errors/");

topicsRouter.route("/").get(getTopics).all(sendError405);

module.exports = topicsRouter;
