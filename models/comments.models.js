const knex = require("../db/connection");

exports.selectCommentById = (comment_id) => {
  return knex("comments")
    .select()
    .where("comment_id", "=", comment_id)
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found!" });
      } else {
        [Comment] = result;
        return Comment;
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
        [updatedComment] = result;
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
