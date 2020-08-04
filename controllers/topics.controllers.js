const { selectTopics } = require("../models/topics.models");

exports.getTopics = () => {
  console.log("in the controller");
  selectTopics();
};
