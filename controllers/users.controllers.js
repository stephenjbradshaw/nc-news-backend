const { selectUser } = require("../models/users.models");

exports.getUser = (req, res, next) => {
  selectUser(req.params)
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
