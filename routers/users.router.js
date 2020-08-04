const usersRouter = require("express").Router();

const { getUser } = require("../controllers/users.controllers");

const { sendError405 } = require("../errors/");

usersRouter.route("/:username").get(getUser).all(sendError405);

module.exports = usersRouter;
