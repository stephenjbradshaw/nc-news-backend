const knex = require("../db/connection");

exports.selectArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  if (order !== "asc" && order !== "desc") order = "desc";
  return knex
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .modify((query) => {
      if (author !== undefined && topic !== undefined) {
        query.where({ "articles.author": author, "articles.topic": topic });
      } else if (author !== undefined)
        query.where("articles.author", "=", author);
      else if (topic !== undefined) query.where("articles.topic", "=", topic);
    })
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: "No articles found!" });
      } else
        return articles.map((article) => {
          article.comment_count = parseInt(article.comment_count, 10);
          return article;
        });
    });
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
        [updatedArticle] = result;
        return updatedArticle;
      }
    });
};

exports.selectCommentsByArticleId = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  if (order !== "asc" && order !== "desc") order = "desc";

  const articlesPromise = knex("articles").where("article_id", "=", article_id);

  const commentsPromise = knex("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by, order);

  return Promise.all([articlesPromise, commentsPromise]).then(
    ([articles, comments]) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      } else return comments;
    }
  );
};

exports.insertCommentByArticleId = (article_id, author, body) => {
  return knex("comments")
    .insert({ article_id: article_id, author: author, body: body })
    .returning("*")
    .then((result) => {
      [newComment] = result;
      return newComment;
    });
};
