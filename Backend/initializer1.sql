drop database if exists db;
create database if not exists db;
use db;
set global local_infile = true;
-- CREATE TABLES
create table if not exists users(
    username varchar(256) unique not null,
    password varchar(256) not null,
    UID int primary key auto_increment,
    balance float not null default 0, 
    propicURL text, 
    blacklistFlag int not null default 0
);

create table if not exists admins(
    adminname varchar(256) unique not null,
    password varchar(256) not null,
    AID int primary key auto_increment
);

create table if not exists product(
    productID int primary key auto_increment,
    pName varchar(256) not null,
    imageURL varchar(256), 
    rating float, 
    quantity int not null default 0,
    catID int not null,
    description text, 
    price float not null
);

create table if not exists ShopCart(
    cartID int primary key auto_increment,
    count int not null,
    UID int not null references user(UID),
    productID int not null references product(productID),
    checkedProd int not null default 0
);

create table if not exists review(
    commentID int primary key auto_increment,
    rating int not null,
    UID int not null references user(UID),
    productID int not null references product(productID),
    date text,
    content text
);


create table if not exists transaction (
    transID int primary key auto_increment, 
    productID int not null references product(productID), 
    UID int not null references user(UID), 
    sum int not null
);

load data local infile 'Product.csv' into table product
fields terminated by ','
enclosed by '"'
lines terminated by '\r\n'
ignore 1 lines
(productID, pName, imageURL, rating, quantity, catID, description, price);



