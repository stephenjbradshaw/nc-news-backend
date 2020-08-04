const knex = require("../db/connection");

exports.selectArticle = ({ article_id }) => {
  return knex
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id")
    .then((articles) => {
      return articles.map((article) => {
        article.comment_count = parseInt(article.comment_count, 10);
        article.created_at = article.created_at.toISOString();
        return article;
      });
    });
};
