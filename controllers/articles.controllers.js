const {
  selectArticles,
  selectArticleById,
  updateArticleById,
} = require("../models/articles.models");

const { selectUserByUsername } = require("../models/users.models");
const { selectTopicBySlug } = require("../models/topics.models");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  let checkDB;

  if (author && !topic) {
    checkDB = selectUserByUsername(author);
  } else if (topic && !author) {
    checkDB = selectTopicBySlug(topic);
  } else if (topic && author) {
    checkDB = selectUserByUsername(author).then(() => {
      return selectTopicBySlug(topic);
    });
  } else checkDB = Promise.resolve();

  checkDB
    .then(() => {
      return selectArticles(sort_by, order, author, topic);
    })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
