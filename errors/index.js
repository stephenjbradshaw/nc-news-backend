// Error-handling middleware
exports.handlePSQL400Errors = (err, req, res, next) => {
  const psqlCodes = ["22P02", "23502", "42703"];
  if (psqlCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request!" });
  } else next(err);
};

exports.handlePSQL404Errors = (err, req, res, next) => {
  const psqlCodes = ["23503"];
  if (psqlCodes.includes(err.code)) {
    res.status(404).send({ msg: "Value not found!" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if ("status" in err) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handle500s = (err, req, res) => {
  res.sendStatus(500);
};

// Controllers
exports.handle405s = (req, res) => {
  res.status(405).send({ msg: "Method not allowed!" });
};
