const querystring = require("querystring");
const https = require("https");

const config = require("../../config");
const helpers = require("../helpers");
const _data = require("../data");

const _checkout = {};

_checkout.processCheckout = function(data, cb) {
  const token =
    typeof data.headers.token === "string" ? data.headers.token : false;

  const paymentToken =
    typeof data.payload.paymentToken === "string"
      ? data.payload.paymentToken
      : false;

  if (token && paymentToken) {
    _data.read("tokens", token, function(err, tokenData) {
      if (!err && tokenData) {
        _data.read("users", tokenData.hashedEmail, function(err, userData) {
          if (!err && userData) {
            const cartData =
              typeof userData.cart === "object" ? userData.cart : false;
            const cartItems =
              typeof cartData.items === "object" &&
              cartData.items instanceof Array
                ? cartData.items
                : false;
            const cartAmount =
              typeof cartData.amount === "number" && cartData.amount > 0
                ? cartData.amount
                : false;

            if (cartData && cartItems && cartAmount) {
              const orderId = helpers.createRandomString(20);
              cartData.id = orderId;
              cartData.userEmail = userData.email;
              cartData.userId = tokenData.hashedEmail;
              cartData.mailSent = false;
              _data.create("orders", orderId, cartData, function(err) {
                if (!err) {
                  delete userData.cart;
                  _data.update(
                    "users",
                    tokenData.hashedEmail,
                    userData,
                    function(err) {
                      if (!err) {
                        _checkout.processPayment(cartData, paymentToken, cb);
                      } else {
                        cb(500, { Error: "Could not update user data" });
                      }
                    }
                  );
                } else {
                  cb(500, { Error: "Could not create order data" });
                }
              });
            } else {
              cb(400, { Error: "Could not find anyting on the user's cart" });
            }
          } else {
            cb(500, { Error: "Could not read user data" });
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

_checkout.processPayment = function(orderData, paymentToken, cb) {
  const payload = {
    amount: orderData.amount,
    currency: "usd",
    description: "charge for order id: " + orderData.id,
    source: paymentToken,
  };

  const stringPayload = querystring.stringify(payload);
  const requestDetails = {
    protocol: "https:",
    hostname: "api.stripe.com",
    method: "POST",
    path: "/v1/charges",
    auth: config.stripeApiKey + ":",
    headers: {
      // Authorization: "Bearer " + config.stripeApiKey,
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(stringPayload),
    },
  };
  const request = https.request(requestDetails, function(response) {
    const status = response.statusCode;
    if (status === 200) {
      const itemsDetails = orderData.items.map(function(item, idx) {
        return `${idx}. ${item.displayName} || Quantity: ${item.qty} || Amount: ${item.price * item.qty}\n`;
      });
      const msg = `
Your order number ${orderData.id} for USD ${orderData.amount /
        100} has been paid.

Details:
${itemsDetails.join("")}

Total Amount Paid: ${orderData.amount}

Hope you enjoy your pizza!
-ADK PIZZA-
      `;
      helpers.mailGunJob(orderData.userEmail, msg, function(err) {
        if (!err) {
          cb(200);
        } else {
          console.log(err);
          cb(500, { Error: "Could not email the user" });
        }
      });
    } else {
      // cb(500, { Error: "Status code from stripe returned : " + status });
      cb(400, { Error: "Invalid payment/card number" });
    }
  });
  request.on("error", function(err) {
    console.log(err);
    cb(500, { Error: "Could not finish stripe payment" });
  });
  request.write(stringPayload);
  request.end();
};

module.exports = _checkout;
