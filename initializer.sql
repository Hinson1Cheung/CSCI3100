create database if not exists shopdatabase;
use shopdatabase;
set global local_infile = true;
-- CREATE TABLES
create table if not exists users(
    UName varchar(256) unique not null,
    PWord varchar(256) not null,
    UID int(20) primary key auto_increment
);

create table if not exists admins(
    AName varchar(256) unique not null,
    Pword varchar(256) not null,
    AID int(20) primary key auto_increment
);

create table if not exists product(
    productID int(20) primary key auto_increment,
    pName varchar(256) not null,
    imageURL varchar(256), 
    rating int(20), 
    category varchar(256) not null,
    description text, 
    price float not null
);

create table if not exists ShopCart(
    
);
