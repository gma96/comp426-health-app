#!/bin/bash
create="DROP DATABASE IF EXISTS health_app_$1;CREATE DATABASE health_app_$1;GRANT ALL PRIVILEGES ON health_app_$1.* TO 'comp426'@'localhost' IDENTIFIED BY 'changeMe';
FLUSH PRIVILEGES;use health_app_$1;"
echo $create | cat - create.sql | mysql -u $2 -p