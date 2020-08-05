const express = require("express");
const apiRouter = require("./routers/api.router");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handle500s,
} = require("./errors/");

const app = express();

app.use("/api", apiRouter);

app.all("/*", (req, res, next) =>
  res.status(404).send({ msg: "Route not found!" })
);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
