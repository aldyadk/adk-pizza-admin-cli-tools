const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

const lib = {};

lib.baseDir = path.join(__dirname, "/../.data/");

lib.create = function(dir, file, data, cb) {
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, "wx", function(
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, function(err) {
        if (!err) {
          fs.close(fileDescriptor, function(err) {
            if (!err) {
              cb(null);
            } else {
              cb("could not close the file beeing writen");
            }
          });
        } else {
          cb("could not write to the file");
        }
      });
    } else {
      cb("could not create new file; it may already exist");
    }
  });
};

lib.read = function(dir, file, cb) {
  fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, "utf8", function(
    err,
    data
  ) {
    if (!err && data) {
      const parsedData = helpers.parseJsonToObject(data);
      cb(err, parsedData);
    } else {
      cb(err, data);
    }
  });
};

lib.update = function(dir, file, data, cb) {
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, "r+", function(
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      fs.ftruncate(fileDescriptor, function(err) {
        if (!err) {
          const stringData = JSON.stringify(data);
          fs.writeFile(fileDescriptor, stringData, function(err) {
            if (!err) {
              fs.close(fileDescriptor, function(err) {
                if (!err) {
                  cb(null);
                } else {
                  cb("could not close the file beeing update");
                }
              });
            } else {
              cb("could not write to the existing file");
            }
          });
        } else {
          cb("could not truncate the file for updating");
        }
      });
    } else {
      cb("could not open the file for updating; it may not exist yet");
    }
  });
};

lib.delete = function(dir, file, cb) {
  fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, function(err) {
    if (!err) {
      cb(null);
    } else {
      cb("could not delete the file");
    }
  });
};

lib.list = function(dir, cb) {
  fs.readdir(`${lib.baseDir}/${dir}/`, function(err, data) {
    if (!err && data && data.length > 0) {
      let trimmedFileNames = [];
      data.forEach(function(fileName) {
        trimmedFileNames.push(fileName.replace(".json", ""));
      });
      cb(null, trimmedFileNames);
    } else {
      cb(err, data);
    }
  });
};

module.exports = lib;
