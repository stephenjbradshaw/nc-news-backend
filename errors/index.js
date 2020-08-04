exports.sendError405 = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed!" });
};

exports.sendError400 = (err, req, res, next) => {
  const psqlCodes = [];
  if (psqlCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request!" });
  } else next(err);
};

exports.sendCustomError = (err, req, res, next) => {
  if ("status" in err) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.sendError500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error!" });
};
