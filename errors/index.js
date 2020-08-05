// Error-handling middleware
exports.handlePSQLErrors = (err, req, res, next) => {
  console.log(err, "<== log of ANY error caught by a catch block");
  const psqlCodes = ["22P02"];
  if (psqlCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request!" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if ("status" in err) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error!" });
};

// Controllers
exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed!" });
};
