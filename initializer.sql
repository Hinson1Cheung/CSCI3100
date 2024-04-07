create database if not exists shopdatabase;
use shopdatabase;
set global local_infile = true;
-- CREATE TABLES
create table if not exists users(
    UName varchar(256) unique not null,
    PWord varchar(256) not null,
    UID int(10) primary key auto_increment,
    balance float not null default 0
);

create table if not exists admins(
    AName varchar(256) unique not null,
    Pword varchar(256) not null,
    AID int(10) primary key auto_increment
);

create table if not exists product(
    productID int(15) primary key auto_increment,
    pName varchar(256) not null,
    imageURL varchar(256), 
    rating int, 
    quantity int not null default 0,
    category varchar(256) not null,
    description text, 
    price float not null
);

create table if not exists ShopCart(
    cartID int(10) primary key auto_increment,
    count int not null,
    UID int(10) not null references user(UID),
    productID int(50) not null references product(productID)
);

create table if not exists category(
    catID int(5) primary key auto_increment, 
    catName varchar(256) not null
);

create table if not exists transaction (
    transID int(30) primary key auto_increment, 
    productID int(15) not null references product(productID), 
    UID int(10) not null references user(UID), 
    sum int not null, 
);
