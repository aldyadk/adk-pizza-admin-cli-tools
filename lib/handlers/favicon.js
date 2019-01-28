const helpers = require("../helpers");

module.exports = function(data, cb) {
  if (data.method === "get") {
    helpers.getStaticAsset("favicon.ico", function(err, data) {
      if (!err && data) {
        cb(200, data, "favicon");
      } else {
        cb(500);
      }
    });
  } else {
    cb(405);
  }
};
