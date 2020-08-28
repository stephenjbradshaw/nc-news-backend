const express = require("express");
const apiRouter = require("./routers/api.router");
const cors = require("cors");
const {
  handlePSQL400Errors,
  handlePSQL404Errors,
  handleCustomErrors,
  handle500s,
} = require("./errors/");

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", (req, res, next) =>
  res.status(404).send({ msg: "Route not found!" })
);

app.use(handlePSQL400Errors);
app.use(handlePSQL404Errors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
