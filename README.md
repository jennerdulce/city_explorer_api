# City Finder

**Author**: Jenner Dulce
**Version**: 1.0.0 (increment the patch/fix version number if you make more commits past your first submission)

## Overview
<!-- Provide a high level overview of what this application is and why you are building it, beyond the fact that it's an assignment for this class. (i.e. What's your problem domain?) -->
Hello! I this application was built to give the current weather data of a particular place that the user is interested in. Maybe planning a day trip? Vacation? This app is perfect for you!

## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->
- Have node and npm installed on your machine
1. make folder
  - cd into it
2. create '.env' file
  - `PORT=3000`
3. create package.json
  - in terminal: `npm init -y`
4. create `server.js` file
  - `'use strict';`
  - import modules/libs/dependencies. What dependencies do we want to use?
  - create full file
    - modules
      - `require.('dotenv').config()`
      - `const express = require('express')`
      - `const cors = require('cors')
    - set up application
      - `const app = express();`
      - `const PORT = process.env.PORT`
      - `app.use(cors());`
    - routes
      - `app.get('', (req,res) => {})`
    - start our server
      - `app.listen(PORT, ()=>{});`
5. install modules to project
  - in terminal: `npm install (express, cors, dotenv)`
6. check to see if server is working
  - in terminal: `node server.js`
  - in browser: `localhost:3000`
6. create github repo
  - completely empty
  - follow steps
7. search for repo in heroku app

## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->
EXPRESS - Express is a flexible Node.js used for as a web framework application. Express offers a thin layer of fundamental web application without obscuring Node.js features.

CORS (Cross-Origin Resource Sharing) - Allows a server to indicate other orgins in a secure manner.

DOTENV - Zero-dependency module that loads environment variables from a .env file. Allows us to locate and access our port we want to connect to.

NODE - Asynchronous event-driven JavaScript runtime environment. Used to design and build scalable network apps.

NPM (Node Package Manager) - Package manger for NODE. Allows users to bring in libraries which are used to help developers build applications

HEROKU - A platform as a service that enables developers to build, run, and operate applications entirely in the cloud

GITHUB - Cloud-based service that helps developers store and manage their code as well as keep tabs on changes to their code.

SUPERAGENT - Allows us to request data by using a URL from APIs and obtains a PROMISE as a response.

APIs - Retrieve data from DATABASES.

DATABASES - Retrieve and Store data to prevent unecessary API calls

## Change Log
<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. -->
12-28-2020 9:48pm - Application now has a fully-functional express server, with a GET route for the location and weather resource.

12-30-2020 12:00pm - Retrieve data using Superagent and API databases

01-06-2020 11:50pm - Using APIs to retrieve and then store to the database. Use databases to retrieve previously searched information.

## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->
LAB 06:
With help and collaboration with: TJ Simms, Mark Duenas, Nicco(TA)

Number and name of feature: Lab 06 Node, NPM, and Express

Estimate of time needed to complete: 3 hours

Start time: 2:00pm

Finish time: 6:00pm

Actual time needed to complete: ~4 hours;


LAB 07:
With help and collaboration with: TJ Simms, Cristian Robles, Skyler(TA)

Number and name of feature: Lab 07 APIs

Estimate of time needed to complete: 2 hours

Start time: 12:00pm

Finish time: 3:00pm

Actual time needed to complete: ~3 hours;


LAB 08:
With help and collaboration with: Cristian Robles

Number and name of feature: Lab 08 SQL

Estimate of time needed to complete: 8 hours

Start time: 7:31pm

Finish time: 11:49pm

Actual time needed to complete: 4 hours 18 minutes