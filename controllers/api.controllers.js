const { readAPIDescription } = require("../models/api.models");

exports.getAPIDescription = (req, res, next) => {
  const cb = (fsPromise) => {
    fsPromise
      .then((apiDescription) => {
        res.status(200).send({ apiDescription });
      })
      .catch(next);
  };

  readAPIDescription(cb);
};
