const knex = require("../db/connection");

exports.selectCommentsByArticleId = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  } else {
    const articlesPromise = knex("articles").where(
      "article_id",
      "=",
      article_id
    );

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
  }
};

exports.insertCommentByArticleId = (article_id, author, body) => {
  return knex("comments")
    .insert({ article_id: article_id, author: author, body: body })
    .returning("*")
    .then((result) => {
      const [newComment] = result;
      return newComment;
    });
};

exports.selectCommentById = (comment_id) => {
  return knex("comments")
    .select()
    .where("comment_id", "=", comment_id)
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found!" });
      } else {
        const [comment] = result;
        return comment;
      }
    });
};

exports.updateCommentById = (comment_id, inc_votes = 0) => {
  return knex("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found!" });
      } else {
        const [updatedComment] = result;
        return updatedComment;
      }
    });
};

exports.removeCommentById = (comment_id) => {
  return knex("comments")
    .where("comment_id", "=", comment_id)
    .del()
    .then((deleteCount) => {
      if (deleteCount === 0)
        return Promise.reject({ status: 404, msg: "Comment not found!" });
    });
};
