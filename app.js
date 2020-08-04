const express = require("express");
const apiRouter = require("./routers/api.router");
const { sendError400, sendCustomError, sendError500 } = require("./errors/");

const app = express();

app.use("/api", apiRouter);

app.all("/*", (req, res, next) =>
  res.status(404).send({ msg: "Route not found!" })
);

app.use(sendError400);
app.use(sendCustomError);
app.use(sendError500);

module.exports = app;
