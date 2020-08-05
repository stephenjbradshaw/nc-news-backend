const knex = require("../db/connection");

exports.selectArticle = (article_id) => {
  return knex
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .where("articles.article_id", "=", article_id)
    .groupBy("articles.article_id")
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      } else {
        const [article] = result;
        article.comment_count = parseInt(article.comment_count, 10);
        article.created_at = article.created_at.toISOString();
        return article;
      }
    });
};

exports.updateArticle = (article_id, inc_votes = 0) => {
  return knex("articles")
    .where("article_id", "=", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      } else {
        [updatedArticle] = result;
        return updatedArticle;
      }
    });
};
