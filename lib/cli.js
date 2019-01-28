const readline = require("readline");
const events = require("events");
const _data = require("./data");
const helpers = require("./helpers");
const menu = require("./menuItems");

const cli = {};

class _events extends events {}
const e = new _events();

e.on("exit", function(str) {
  cli.responders.exit();
})
  .on("man", function(str) {
    cli.responders.help();
  })
  .on("help", function(str) {
    cli.responders.help();
  })
  .on("list users", function(str) {
    cli.responders.listUsers(str);
  })
  .on("more user info", function(str) {
    cli.responders.moreUserInfo(str);
  })
  .on("list orders", function(str) {
    cli.responders.listOrders(str);
  })
  .on("more order info", function(str) {
    cli.responders.moreOrderInfo(str);
  })
  .on("list menu", function(str) {
    cli.responders.listMenu();
  });

cli.verticalSpace = function(lines) {
  lines = typeof lines === "number" && lines > 0 ? lines : 1;
  for (let i = 0; i < lines; i++) {
    console.log("");
  }
};

cli.horizontalLine = function() {
  const width = process.stdout.columns;
  let line = "";
  for (let i = 0; i < width; i++) {
    line += "-";
  }
  console.log(line);
};

cli.centered = function(string) {
  string =
    typeof string === "string" && string.trim().length > 0 ? string.trim() : "";
  const width = process.stdout.columns;
  const leftPadding = Math.floor((width - string.length) / 2);
  let line = "";
  for (let i = 0; i < leftPadding; i++) {
    line += " ";
  }
  line += string;
  console.log(line);
};

cli.responders = {};

cli.responders.exit = function() {
  process.exit(0);
};

cli.responders.help = function() {
  const commands = {
    exit: "Kill the CLI and the rest of the application",
    man: "Show this help page",
    help: "Alias of the 'man' command",
    "list users --recent":
      "Show a list of all the registered (undeleted) users in the system. The '--recent' flag is optional to only list entries from the last 24 hours",
    "more user info --{emailAddress}": "Show details of the specified user",
    "list orders --recent":
      "Show a list of all orders in the system. The '--recent' flag is optional to only list entries from the last 24 hours",
    "more order info --{orderId}": "Show details of the specified order",
    "list menu": "Show a list of all the pizza available from the menu",
  };

  cli.horizontalLine();
  cli.centered("ADK PIZZA - ADMIN CLI MANUAL");
  cli.horizontalLine();
  cli.verticalSpace(2);

  for (let key in commands) {
    if (commands.hasOwnProperty(key)) {
      const value = commands[key];
      let line = "\x1b[33m" + key + "\x1b[0m";
      let padding = 60 - line.length;
      for (let i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace();
  cli.horizontalLine();
};

cli.responders.listUsers = function(str) {
  _data.list("users", function(err, userIds) {
    if (!err && userIds && userIds.length > 0) {
      cli.verticalSpace();
      userIds.forEach(function(userId) {
        _data.read("users", userId, function(err, userData) {
          if (!err && userData) {
            const lowerString = str.toLowerCase();
            if (lowerString.indexOf("--recent") > -1) {
              if (userData.createdAt > Date.now() - 1000 * 60 * 60 * 24) {
                const line = `Name: ${userData.fullName} Email: ${
                  userData.email
                }`;
                console.log(line);
                cli.verticalSpace();
              }
            } else {
              const line = `Name: ${userData.fullName} Email: ${
                userData.email
              }`;
              console.log(line);
              cli.verticalSpace();
            }
          }
        });
      });
    }
  });
};

cli.responders.moreUserInfo = function(str) {
  const arr = str.split("--");
  const email =
    typeof arr[1] === "string" && arr[1].trim().length > 0
      ? arr[1].trim()
      : false;
  const hashedEmail = helpers.hash(email);
  if (hashedEmail) {
    _data.read("users", hashedEmail, function(err, userData) {
      if (!err && userData) {
        delete userData.hashedPassword;
        cli.verticalSpace();
        console.dir(userData, { colors: true });
        cli.verticalSpace();
      }
    });
  }
};

cli.responders.listOrders = function(str) {
  _data.list("orders", function(err, orderIds) {
    if (!err && orderIds && orderIds.length > 0) {
      cli.verticalSpace();
      orderIds.forEach(function(orderId) {
        _data.read("orders", orderId, function(err, orderData) {
          if (!err && orderData) {
            const lowerString = str.toLowerCase();
            if (lowerString.indexOf("--recent") > -1) {
              if (orderData.createdAt > Date.now() - 1000 * 60 * 60 * 24) {
                const line = `Id: ${orderData.id} Email: ${
                  orderData.userEmail
                } Ordered At: ${new Date(orderData.createdAt)}`;
                console.log(line);
                cli.verticalSpace();
              }
            } else {
              const line = `Id: ${orderData.id} Email: ${
                orderData.userEmail
              } Ordered At: ${new Date(orderData.createdAt)}`;
              console.log(line);
              cli.verticalSpace();
            }
          }
        });
      });
    }
  });
};

cli.responders.moreOrderInfo = function(str) {
  const arr = str.split("--");
  const orderId =
    typeof arr[1] === "string" && arr[1].trim().length > 0
      ? arr[1].trim()
      : false;
  if (orderId) {
    _data.read("orders", orderId, function(err, orderData) {
      if (!err && orderData) {
        cli.verticalSpace();
        console.dir(orderData, { colors: true });
        cli.verticalSpace();
      }
    });
  }
};

cli.responders.listMenu = function() {
  console.dir(menu, { colors: true });
};

cli.processInput = function(str) {
  str = typeof str === "string" && str.trim().length > 0 ? str.trim() : false;

  if (str) {
    const uniqueInput = [
      "exit",
      "man",
      "help",
      "list users",
      "more user info",
      "list orders",
      "more order info",
      "list menu",
    ];

    let matchFound = false;
    let counter = 0;
    uniqueInput.some(function(input) {
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;
        e.emit(input, str);
        return true;
      }
    });

    if (!matchFound) {
      console.log("Sorry, try again");
    }
  }
};

cli.init = function() {
  console.log("\x1b[35m%s\x1b[0m", "The CLI is running");
  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "admin-cli > ",
  });

  _interface.prompt();

  _interface.on("line", function(str) {
    cli.processInput(str);
    _interface.prompt();
  });

  _interface.on("close", function() {
    process.exit(0);
  });
};

module.exports = cli;
