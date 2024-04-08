create table if not exists category(
    catID int primary key auto_increment, 
    catName varchar(256) not null
);

load data local infile 'Category.csv' into table category
fields terminated by ','
enclosed by '"'
lines terminated by '\r\n'
ignore 1 lines
(catID,catName);
