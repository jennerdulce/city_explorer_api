'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { response } = require('express');


const app = express();
const PORT = process.env.PORT;
app.use(cors());

// Requests
app.get('/', defaultHandler);
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', catchAllHandler);

// Handlers
function locationHandler(req, res) {

  try {
    // request
    const location = require('./data/location.json');
    const city = req.query.city;

    // tailor
    const locationData = new Location(city, location);

    // respond
    res.send(locationData);
  }

  catch (error) {
    res.status(500).send('Sorry, something went wrong');
  }
}

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

function weatherHandler(req, res) {

  try {
    // request
    const weather = require('./data/weather.json');
    const listPlaces = [];

    // tailor
    weather.data.forEach(location => {
      const place = new Weather(location);
      listPlaces.push(place);
    });

    // respond
    res.send(listPlaces);
  }

  catch (error) {
    res.status(500).send('Sorry, something went wrong');
  }
}

function Weather(data) {
  this.forecast = data.weather.description;
  this.time = data.datetime;
}

function defaultHandler(req, res) {
  res.send('Hello World');
}

function catchAllHandler(req, res) {
  res.send('404. Does Not Exist.');
}


// .listen() to deploy server.
app.listen(PORT, () => {
  console.log(`Now listening on port, ${PORT}`);
});
