'use strict';

let flag = false;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Requests
// /location & /weather are Routes
app.get('/', defaultHandler);
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', catchAllHandler);

// Handlers
function locationHandler(req, res) {
  let key = process.env.GEOCODE_API_KEY;
  const city = req.query.city;
  // '&' separates url parameters
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

  if (city === '' || !city) {
    res.status(500).send('Sorry, something went wrong.');
    flag = true;
  }

  // request
  superagent.get(url)
    // data = response object
    .then(data => {
      const locationData = data.body[0];

      // tailor
      const location = new Location(city, locationData);
      // console.log(locationData);

      // respond
      res.status(200).json(location); // switch from .send to .json
    }).catch(err => {
      // .error() stands out
      console.error('Error occured in LOCATION', err);
    });
}

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}

function weatherHandler(req, res) {

  // TO USE API: 1. key; 2. url
  let key = process.env.WEATHERBIT_API_KEY;
  let currentLat = req.query.latitude;
  let currentLon = req.query.longitude;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?&lat=${currentLat}&lon=${currentLon}&key=${key}`;

  // making the request to the
  superagent.get(url)

    .then(response => {
      const weatherData = response.body.data;

      // tailor
      const weatherInfo = weatherData.map(value => {
        return new Weather(value); // return adds to the array
      });

      // response
      res.status(200).send(weatherInfo); // switch from .send to .json
    });
}

function Weather(data) {
  this.forecast = data.weather.description;
  this.time = new Date(data.datetime).toDateString();
}

function defaultHandler(req, res) {
  res.status(200).send('Hello World');
}

function catchAllHandler(req, res) {
  res.status(500).send('404. This Route Does Not Exist.');
}


// .listen() to deploy server.
app.listen(PORT, () => {
  console.log(`Now listening on port, ${PORT}`);
});
