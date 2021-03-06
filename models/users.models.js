const knex = require("../db/connection");

exports.selectUserByUsername = (username) => {
  return knex
    .select("*")
    .from("users")
    .where("username", "=", username)
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found!" });
      } else {
        const [user] = result;
        return user;
      }
    });
};
