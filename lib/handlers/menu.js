const _data = require("../data");

const menuItems = require("../menuItems");

module.exports = function(data, cb) {
  const token =
    typeof data.headers.token === "string" ? data.headers.token : false;

  _data.read("tokens", token, function(err, tokenData) {
    if (!err && tokenData) {
      if (tokenData.expires > Date.now()) {
        cb(200, menuItems);
      } else {
        cb(403, { Error: "Token has already expired" });
      }
    } else {
      cb(403, {
        Error: "Missing required token in header or token is invalid",
      });
    }
  });
};
