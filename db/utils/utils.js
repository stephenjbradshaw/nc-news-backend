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
  return [];
};
