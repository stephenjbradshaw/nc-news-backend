exports.formatDates = (array) => {
  return array.map((obj) => {
    return { ...obj, created_at: new Date(obj.created_at) };
  });
};

exports.makeRefObj = (array) => {};

exports.formatComments = (comments, articleRef) => {};
