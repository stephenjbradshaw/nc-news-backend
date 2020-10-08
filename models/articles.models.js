const knex = require("../db/connection");

exports.selectArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  } else {
    return knex
      .select("articles.*")
      .from("articles")
      .count({ comment_count: "comments.comment_id" })
      .leftJoin("comments", "comments.article_id", "articles.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by, order)
      .modify((query) => {
        if (author) query.where("articles.author", "=", author);
        if (topic) query.where("articles.topic", "=", topic);
      })
      .then((articles) => {
        return articles.map((article) => {
          article.comment_count = parseInt(article.comment_count, 10);
          return article;
        });
      });
  }
};

exports.selectArticleById = (article_id) => {
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
        return article;
      }
    });
};

exports.updateArticleById = (article_id, inc_votes = 0) => {
  return knex("articles")
    .where("article_id", "=", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      } else {
        const [updatedArticle] = result;
        return updatedArticle;
      }
    });
};
