const knex = require("../db/connection");

exports.selectTopics = () => {
  return knex.select("*").from("topics");
};

exports.selectTopicBySlug = (slug) => {
  return knex
    .select("*")
    .from("topics")
    .where("slug", "=", slug)
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Topic not found!" });
      } else {
        const [topic] = result;
        return topic;
      }
    });
};
