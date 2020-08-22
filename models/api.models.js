const fs = require("fs");

exports.readAPIDescription = (cb) => {
  fs.readFile("endpoints.json", "utf8", (err, data) => {
    if (err) cb(Promise.reject(err));
    else cb(Promise.resolve(JSON.parse(data)));
  });
};
