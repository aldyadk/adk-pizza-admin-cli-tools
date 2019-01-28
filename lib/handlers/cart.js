const _data = require("../data");
const menuItems = require("../menuItems");

module.exports = function(data, cb) {
  const token =
    typeof data.headers.token === "string" ? data.headers.token : false;

  const itemsToAdd =
    typeof data.payload.items === "object" &&
    data.payload.items instanceof Array &&
    data.payload.items.length > 0
      ? data.payload.items
      : false;

  if (token && itemsToAdd) {
    _data.read("tokens", token, function(err, tokenData) {
      if (!err && tokenData) {
        if (tokenData.expires > Date.now()) {
          _data.read("users", tokenData.hashedEmail, function(err, userData) {
            if (!err && userData) {
              const cartData =
                typeof userData.cart === "object" ? userData.cart : {};
              const cartItems =
                typeof cartData.items === "object" &&
                cartData.items instanceof Array
                  ? cartData.items
                  : [];
              let cartAmount =
                typeof cartData.amount === "number" && cartData.amount > 0
                  ? cartData.amount
                  : 0;

              const invalidItems = [];
              itemsToAdd.forEach(function(itemName) {
                if (menuItems[itemName]) {
                  const duplicateIndex = cartItems.findIndex(function(item) {
                    return item.id === itemName;
                  });
                  if (duplicateIndex > -1) {
                    const duplicateItem = cartItems[duplicateIndex];
                    duplicateItem.qty++;
                    cartAmount += menuItems[itemName].price;
                  } else {
                    const itemToPush = menuItems[itemName];
                    itemToPush.qty = 1;
                    cartItems.push(itemToPush);
                    cartAmount += menuItems[itemName].price;
                  }
                } else {
                  invalidItems.push(itemName);
                }
              });
              cartData.items = cartItems;
              cartData.amount = cartAmount;
              if (invalidItems.length > 0) {
                cb(400, {
                  Error: "There are some invalid items in the request",
                  items: invalidItems,
                });
              } else {
                userData.cart = cartData;
                _data.update("users", tokenData.hashedEmail, userData, function(
                  err
                ) {
                  if (!err) {
                    cb(200);
                  } else {
                    cb(500, { Error: "Could not update user cart" });
                  }
                });
              }
            } else {
              cb(500, { Error: "Could not read user data" });
            }
          });
        } else {
          cb(400, { Error: "Specified token has already expired" });
        }
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
