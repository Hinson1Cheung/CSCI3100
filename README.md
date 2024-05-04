## ShopVista - CSCI3100 Project - GroupG3
Authors:
Cheung Siu Hin
Lei Shing Hon
Li Zerong
Ma Yuan
Ng Kit Yiu

## About the project
This project implements ShopVista, an mini online shopping mall system. Where users could perform the following operations
* Register for an account
* Login to said account
* Browse the catalogue for products they want to buy
* Add / Remove these items from the shopping cart
* Checkout from the shopping cart and make a payment (simulated)
* Leave reviews for the product
* Check your profile for purchases

While administrators could enjoy the following functions
* Add / Remove users from the system
* Modify user information
* Remove items from the store
* Blacklist users from the system

## Implementation methods
This program used the following implementation technologies
### Frontend
* Node JS express package
* HTML (in EJS format)
### Backend
* Node JS expresss package
* MySQL Server 8.3

## Prerequisites
Before running this application, users should perform the following commands:
1. Install MySQL Server: https://dev.mysql.com/downloads/installer/
2. Install Node JS (Command may depend on Operating System)
   For windows, follow the instructions of this website: https://phoenixnap.com/kb/install-node-js-npm-on-windows
   <br>
   For MAC terminal or ubuntu, input the following commands:
   ```sh
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
   nvm install node
   ```
4. For command line, install the following packages:
   ```sh
   npm install express
   npm install express-session
   npm install express-flash
   npm install path
   npm install body-parser
   npm install express-fileupload
   npm install multer
   npm install async
   ```


