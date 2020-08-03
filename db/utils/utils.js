exports.formatDates = (array) => {
  if (array.length == 0) return [];
  array[0].created_at = new Date(array[0].created_at);
  return array;
};

exports.makeRefObj = (array) => {};

exports.formatComments = (comments, articleRef) => {};
