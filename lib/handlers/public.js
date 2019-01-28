const helpers = require("../helpers");

module.exports = function(data, cb) {
  if (data.method === "get") {
    const trimmedAssetName = data.trimmedPath.replace("public/", "");
    if (trimmedAssetName.length > 0) {
      helpers.getStaticAsset(trimmedAssetName, function(err, data) {
        if (!err && data) {
          let contentType = "plain";
          if (trimmedAssetName.indexOf(".css") > -1) {
            contentType = "css";
          }
          if (trimmedAssetName.indexOf(".png") > -1) {
            contentType = "png";
          }
          if (trimmedAssetName.indexOf(".jpg") > -1) {
            contentType = "jpg";
          }
          if (trimmedAssetName.indexOf(".ico") > -1) {
            contentType = "favicon";
          }
          cb(200, data, contentType);
        } else {
          cb(404);
        }
      });
    } else {
      cb(404);
    }
  } else {
    cb(405);
  }
};
