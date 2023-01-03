# [Taipei-day-trip-website](https://taipeitrip.serveirc.com/user)

Taipei Day Trip is a website that allows you to discover and explore special attractions in Taipei city. In addition, the website offers a member center where you can view your past orders and schedule future trips. You can easily plan your trip to Taipei and make the most of your time in the city.

This is my first project in the WeHelp boot camp, and the website designed is base on this [figma prototype](https://www.figma.com/file/MZkYBH31H5gyLoZoZq116j/Taipei-Trip-%E5%8F%B0%E5%8C%97%E4%B8%80%E6%97%A5%E9%81%8A-2.0?t=klEcrdQ8vJZwSQ42-0) and [API documentation](https://app.swaggerhub.com/apis-docs/padax/taipei-day-trip/1.1.0).

Test account and password: aniya@gmail.com / 123456

Test Card Number: 4761877684267695 / Date: 02/26 / CVV: 517

![GIF1](http://g.recordit.co/7j93YGsJ41.gif)
![GIF2](http://g.recordit.co/ijmVT9FMqX.gif)

## Table of Contents

-   [Main Features](#main-features)
-   [Backend Technique](#backend-technique)
-   [Architecture](#architecture)
-   [Database Schema](#database-schema)
-   [Frontend Technique](#frontend-technique)

## Main Features

-   The member system uses JWT tokens and includes both access and refresh tokens.
-   Redis is used to block attempts to refresh tokens by logged out users.
-   Allows users to retrieve their passwords through email verification and receive a new password.
-   A loading animation is displayed while images are being downloaded.
-   Allows users to view and modify their personal information, password, and profile picture.
-   Allows users to view their past orders and travel history for the year.
-   Shows a calendar view of the user's travel history.

## Backend Technique

### Framework

-   Flask (Python)

### Database

-   MySQL

### Infrastructure

-   Docker
-   Docker-compose
-   DNS
-   SSL(Let's Encrypt)
-   NGINX
-   uWSGI

### Cache

-   Redis

### Cloud Services

-   EC2
-   S3

### Test

-   Pytest (Python)

### Third Party Library

-   Flask-sqlalchemy
-   bcrypt
-   Flask-JWT-Extended

# Architecture

![structure](https://user-images.githubusercontent.com/108926305/210317038-553001d2-0088-4489-a669-bc8b9a123f85.jpg)

# Database Schema

![image](https://user-images.githubusercontent.com/108926305/210312094-7d199be4-adc1-4a10-83de-e0eaa2b9360c.png)

# Frontend Technique

-   HTML
-   CSS
-   Javascript
-   Third-party package
    -   Chart.js
    -   croppie.js
    -   FullCalendar.js
