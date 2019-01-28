const _data = require("../data");
const helpers = require("../helpers");

const _users = {};

_users.post = function(data, cb) {
  const fullName =
    typeof data.payload.fullName === "string" &&
    data.payload.fullName.trim().length > 0
      ? data.payload.fullName.trim()
      : false;

  const email =
    typeof data.payload.email === "string" &&
    data.payload.email.trim().length > 0 &&
    /^\S+@\S+$/.test(data.payload.email)
      ? data.payload.email.trim()
      : false;

  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  const address =
    typeof data.payload.address === "string" &&
    data.payload.address.trim().length > 0
      ? data.payload.address.trim()
      : false;

  if (fullName && email && password && address) {
    const hashedEmail = helpers.hash(email);
    _data.read("users", hashedEmail, function(err, userData) {
      if (err) {
        const hashedPassword = helpers.hash(password);
        if (hashedPassword) {
          const userData = {
            fullName,
            email,
            hashedPassword,
            address,
          };
          _data.create("users", hashedEmail, userData, function(err) {
            if (!err) {
              cb(200);
            } else {
              console.log(err);
              cb(500, { Error: "Could not create user" });
            }
          });
        } else {
          cb(500, { Error: "Could not hash the user's password" });
        }
      } else {
        cb(400, { Error: "Email already registered" });
      }
    });
  } else {
    cb(400, { Error: "Missing required fields" });
  }
};

_users.get = function(data, cb) {
  const hashedEmail =
    typeof data.queryStringObject.hashedEmail === "string" &&
    data.queryStringObject.hashedEmail.trim().length > 0
      ? data.queryStringObject.hashedEmail.trim()
      : false;

  if (hashedEmail) {
    const token =
      typeof data.headers.token === "string" ? data.headers.token : false;

    _users.verifyToken(token, hashedEmail, function(tokenIsValid) {
      if (tokenIsValid) {
        _data.read("users", hashedEmail, function(err, userData) {
          if (!err && userData) {
            delete userData.hashedPassword;
            cb(200, userData);
          } else {
            cb(400, { Error: "Could not find specified user" });
          }
        });
      } else {
        cb(403, {
          Error: "Missing required token in header or token is invalid",
        });
      }
    });
  } else {
    cb(400, { Error: "Missing required fields" });
  }
};

_users.put = function(data, cb) {
  const fullName =
    typeof data.payload.fullName === "string" &&
    data.payload.fullName.trim().length > 0
      ? data.payload.fullName.trim()
      : false;

  const email =
    typeof data.payload.email === "string" &&
    data.payload.email.trim().length > 0 &&
    /^\S+@\S+$/.test(data.payload.email)
      ? data.payload.email.trim()
      : false;

  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  const address =
    typeof data.payload.address === "string" &&
    data.payload.address.trim().length > 0
      ? data.payload.address.trim()
      : false;

  if (email) {
    if (fullName || password || address) {
      const token =
        typeof data.headers.token === "string" ? data.headers.token : false;
      const hashedEmail = helpers.hash(email);

      _users.verifyToken(token, hashedEmail, function(tokenIsValid) {
        if (tokenIsValid) {
          _data.read("users", hashedEmail, function(err, userData) {
            if (!err && userData) {
              if (fullName) {
                userData.fullName = fullName;
              }
              if (address) {
                userData.address = address;
              }
              if (password) {
                const hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                  userData.hashedPassword = hashedPassword;
                  _data.update("users", hashedEmail, userData, function(err) {
                    if (!err) {
                      cb(200);
                    } else {
                      console.log(err);
                      cb(500, { Error: "Could not update user" });
                    }
                  });
                } else {
                  cb(500, { Error: "Could not hash the user's password" });
                }
              } else {
                _data.update("users", hashedEmail, userData, function(err) {
                  if (!err) {
                    cb(200);
                  } else {
                    console.log(err);
                    cb(500, { Error: "Could not update user" });
                  }
                });
              }
            } else {
              cb(400, { Error: "User doesn't exist" });
            }
          });
        } else {
          cb(403, {
            Error: "Missing required token in header or token is invalid",
          });
        }
      });
    } else {
      cb(400, { Error: "Missing fields to update" });
    }
  } else {
    cb(400, { Error: "Missing required fields" });
  }
};

_users.delete = function(data, cb) {
  const email =
    typeof data.queryStringObject.email === "string" &&
    data.queryStringObject.email.trim().length > 4
      ? data.queryStringObject.email.trim()
      : false;

  if (email) {
    const token =
      typeof data.headers.token === "string" ? data.headers.token : false;

    const hashedEmail = helpers.hash(email);

    _users.verifyToken(token, hashedEmail, function(tokenIsValid) {
      if (tokenIsValid) {
        _data.read("users", hashedEmail, function(err, userData) {
          if (!err && userData) {
            _data.delete("users", hashedEmail, function(err) {
              if (!err) {
                cb(200);
              } else {
                cb(400, { Error: "Could not delete specified user" });
              }
            });
          } else {
            cb(400, { Error: "Could not find specified user" });
          }
        });
      } else {
        cb(403, {
          Error: "Missing required token in header or token is invalid",
        });
      }
    });
  } else {
    cb(400, { Error: "Missing required fields" });
  }
};

_users.verifyToken = function(id, hashedEmail, cb) {
  _data.read("tokens", id, function(err, tokenData) {
    if (!err && tokenData) {
      if (
        hashedEmail === tokenData.hashedEmail &&
        tokenData.expires > Date.now()
      ) {
        cb(true);
      } else {
        cb(false);
      }
    } else {
      cb(false);
    }
  });
};

module.exports = _users;
