# aldyadk's Homework assignment #3

Repository of [Pirple's](https://pirple.thinkific.com) Nodejs Masterclass Course

#### Requirements

[NodeJS](https://nodejs.org/en/)

## API Definition

### api/users

#### [POST]  http://localhost:3000/api/users


Example payload request:

```json
{
    "fullName": "Full Name",
    "email": "example@domain.com",
    "address": "your address",
    "password": "your password"
}
```


#### [GET]  http://localhost:3000/api/users?id=xxxxxxxxxHASHEDEMAILADDRESSxxxxxxxxx

Requires token string in header,

token : xxxxxxxTOKENxxxxxxx

The required id in querystring is the hashed email address


#### [PUT]  http://localhost:3000/api/users

Requires token string in header,

token : xxxxxxxTOKENxxxxxxx

```json
{
	"id": "xxxxxxxxxHASHEDEMAILADDRESSxxxxxxxxx",    //required field
	"fullName":"New Name", //optional
	"address":"New Address", //optional
	"password":"New Password" //optional
}
```

#### [DELETE] http://localhost:3000/api/users?id=xxxxxxxxxHASHEDEMAILADDRESSxxxxxxxxx

Requires token string in header,

token : xxxxxxxTOKENxxxxxxx



### api/login

#### [POST]  http://localhost:3000/api/login

```json
{
	"email": "example@domain.com",
	"password": "Your password"

}
```

### api/logout

#### [POST]  http://localhost:3000/api/logout

Requires token string in header,

token : xxxxxxxTOKENxxxxxxx

Note: it removes the token from the system itself.


### api/show-menu

#### [GET] http://localhost:3000/api/show-menu

Requires token string in header,

token : xxxxxxxTOKENxxxxxxx

Returns the list of possible pizza's to select, 

### /add-to-cart

#### [POST] http://localhost:3000/api/add-to-cart

Requires token string in header,

token : xxxxxxxTOKENxxxxxxx

```json
{
	"items":["veggieGarden","superSupreme"] 
}
```

Note: items should be an array of valid pizza names from the list of menu items. It allows multiple to add multiple pizzas with same name to the cart. After adding the shoppingcart array of the user object is updated.

Valid names: veggieGarden, meatLovers, splitza, superSupreme, pepperoniJalapeno, tunaMelt, hawaiianChicken



### api/checkout-order

#### [POST] http://localhost:3000/api/checkout-order

Requires token string in header,

token : xxxxxxxTOKENxxxxxxx

Also requires the following data on body (json), the id of the order to checkout and the stripe token to apply the charge (in this case it's a test token)

```json
{
	"paymentToken": "tok_visa"
}
```

Note: it creates a new order with all the items on user's cart and save it on the system, using the data folder called 'orders', the total price of the order is also calculated based on each price of pizza on the order.
After placing the order, the cart gets empty, and send receipt email to the user.
