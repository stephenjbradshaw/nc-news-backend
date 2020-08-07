const knex = require("../db/connection");

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
