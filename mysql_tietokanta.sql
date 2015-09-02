rhc ssh irclokki
mysql 
DROP DATABASE if exists irclog;
CREATE DATABASE irclog;
USE irclog;
CREATE TABLE log (id INT PRIMARY KEY AUTO_INCREMENT, timestamp BIGINT, message TEXT); 