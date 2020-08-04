const { selectArticle } = require("../models/articles.models");

exports.getArticle = (req, res, next) => {
  selectArticle(req.params)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
