exports.formatDates = (array) => {
  return array.map((obj) => {
    return { ...obj, created_at: new Date(obj.created_at) };
  });
};

exports.makeRefObj = (array, keyTarget, valueTarget) => {
  const lookup = {};
  array.forEach((obj) => {
    lookup[obj[keyTarget]] = obj[valueTarget];
  });
  return lookup;
};

exports.formatComments = (comments, articleRef) => {
  const formattedComments = comments.map((comment) => {
    const newComment = { ...comment };

    newComment.author = newComment.created_by;
    delete newComment.created_by;

    newComment.article_id = articleRef[newComment.belongs_to];

    delete newComment.belongs_to;

    newComment.created_at = new Date(newComment.created_at);

    return newComment;
  });

  return formattedComments;
};
