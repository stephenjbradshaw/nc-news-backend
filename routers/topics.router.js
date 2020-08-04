const topicsRouter = require("express").Router();

const { getTopics } = require("../controllers/topics.controllers");

const { send405Error } = require("../errors/index");

topicsRouter.route("/").get(getTopics).all(send405Error);

module.exports = topicsRouter;
