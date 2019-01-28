const helpers = require("../helpers");

const lib = {};

lib.homePage = function(data, cb) {
  if (data.method === "get") {
    const templateData = {
      "head.title": "ADK PIZZA",
      "head.description": "We promise Delicious Pizza for you",
      "body.class": "index",
    };
    helpers.getTemplate("homePage", templateData, function(
      err,
      templateString
    ) {
      if (!err && templateString) {
        helpers.addUniversalTemplates(templateString, templateData, function(
          err,
          str
        ) {
          if (!err && str) {
            cb(200, str, "html");
          } else {
            cb(500, null, "html");
          }
        });
      } else {
        cb(500, null, "html");
      }
    });
  } else {
    cb(405, null, "html");
  }
};

lib.accountCreate = function(data, cb) {
  if (data.method === "get") {
    const templateData = {
      "head.title": "Create an Account",
      "head.description": "Sign up is easy and only takes few seconds",
      "body.class": "accountCreate",
    };
    helpers.getTemplate("accountCreate", templateData, function(
      err,
      templateString
    ) {
      if (!err && templateString) {
        helpers.addUniversalTemplates(templateString, templateData, function(
          err,
          str
        ) {
          if (!err && str) {
            cb(200, str, "html");
          } else {
            cb(500, null, "html");
          }
        });
      } else {
        cb(500, null, "html");
      }
    });
  } else {
    cb(405, null, "html");
  }
};

lib.sessionCreate = function(data, cb) {
  if (data.method === "get") {
    const templateData = {
      "head.title": "Login to your Account",
      "head.description":
        "Please enter your phone number and password to access your account",
      "body.class": "sessionCreate",
    };
    helpers.getTemplate("sessionCreate", templateData, function(
      err,
      templateString
    ) {
      if (!err && templateString) {
        helpers.addUniversalTemplates(templateString, templateData, function(
          err,
          str
        ) {
          if (!err && str) {
            cb(200, str, "html");
          } else {
            cb(500, null, "html");
          }
        });
      } else {
        cb(500, null, "html");
      }
    });
  } else {
    cb(405, null, "html");
  }
};

lib.sessionDeleted = function(data, cb) {
  if (data.method === "get") {
    const templateData = {
      "head.title": "Logged Out",
      "head.description": "You have been logged out of your account",
      "body.class": "sessionDeleted",
    };
    helpers.getTemplate("sessionDeleted", templateData, function(
      err,
      templateString
    ) {
      if (!err && templateString) {
        helpers.addUniversalTemplates(templateString, templateData, function(
          err,
          str
        ) {
          if (!err && str) {
            cb(200, str, "html");
          } else {
            cb(500, null, "html");
          }
        });
      } else {
        cb(500, null, "html");
      }
    });
  } else {
    cb(405, null, "html");
  }
};

lib.accountEdit = function(data, cb) {
  if (data.method === "get") {
    const templateData = {
      "head.title": "Account Settings",
      "body.class": "accountEdit",
    };
    helpers.getTemplate("accountEdit", templateData, function(
      err,
      templateString
    ) {
      if (!err && templateString) {
        helpers.addUniversalTemplates(templateString, templateData, function(
          err,
          str
        ) {
          if (!err && str) {
            cb(200, str, "html");
          } else {
            cb(500, null, "html");
          }
        });
      } else {
        cb(500, null, "html");
      }
    });
  } else {
    cb(405, null, "html");
  }
};

lib.accountDeleted = function(data, cb) {
  if (data.method === "get") {
    const templateData = {
      "head.title": "Account Deleted",
      "head.description": "Your account has been deleted",
      "body.class": "accountDeleted",
    };
    helpers.getTemplate("accountDeleted", templateData, function(
      err,
      templateString
    ) {
      if (!err && templateString) {
        helpers.addUniversalTemplates(templateString, templateData, function(
          err,
          str
        ) {
          if (!err && str) {
            cb(200, str, "html");
          } else {
            cb(500, null, "html");
          }
        });
      } else {
        cb(500, null, "html");
      }
    });
  } else {
    cb(405, null, "html");
  }
};

lib.orderPage = function(data, cb) {
  if (data.method === "get") {
    const templateData = {
      "head.title": "Order Page",
      "body.class": "orderPage",
    };
    helpers.getTemplate("orderPage", templateData, function(
      err,
      templateString
    ) {
      if (!err && templateString) {
        helpers.addUniversalTemplates(templateString, templateData, function(
          err,
          str
        ) {
          if (!err && str) {
            cb(200, str, "html");
          } else {
            cb(500, null, "html");
          }
        });
      } else {
        cb(500, null, "html");
      }
    });
  } else {
    cb(405, null, "html");
  }
};

lib.checkoutOrder = function(data, cb) {
  if (data.method === "get") {
    const templateData = {
      "head.title": "Checkout Your Cart Here",
      "body.class": "checkoutOrder",
    };
    helpers.getTemplate("checkoutOrder", templateData, function(
      err,
      templateString
    ) {
      if (!err && templateString) {
        helpers.addUniversalTemplates(templateString, templateData, function(
          err,
          str
        ) {
          if (!err && str) {
            cb(200, str, "html");
          } else {
            cb(500, null, "html");
          }
        });
      } else {
        cb(500, null, "html");
      }
    });
  } else {
    cb(405, null, "html");
  }
};

module.exports = lib;
