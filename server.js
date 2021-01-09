'use strict';

// DEPENDENCIES
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');

// START APP
const app = express();
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {
  throw err;
});
app.use(cors());


// Requests
// /location & /weather are Routes
app.get('/', defaultHandler);
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', catchAllHandler);

function addNewLocation(city, location) {
  const addLocationSQL = `INSERT INTO locations
                        (search_query, formatted_query, latitude, longitude)
                        VALUES ($1, $2, $3, $4)
                        RETURNING *`;
  const safeValues = [location.search_query, location.formatted_query, location.latitude, location.longitude];

  client.query(addLocationSQL, safeValues)
    .then( () => {
      console.log(`ADDED '${location.search_query}' information to the database..`);
    })
    .catch(error => {
      console.log(error);
    });
}

function checkLocation(city, url, res) {
  const findLocationSQL = `SELECT *
                          FROM locations
                          WHERE search_query LIKE $1`;
  const safeValues = [city];
  client.query(findLocationSQL, safeValues) // requests specfic data from data base
    .then(results => {
      // console.log(results);
      if (results.rowCount === 0) {
        runLocationApi(city, url, res);
      } else if (results.rowCount === 1) {
        console.log('TALKED TO DATABASE', results.rows[0]);
        res.status(200).json(results.rows[0]);
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function runLocationApi(city, url, res) {
  // request
  superagent.get(url)
    // data = response object
    .then(data => {
      const locationData = data.body[0];

      // tailor
      const location = new Location(city, locationData);
      console.log('TALKED TO API', location);
      addNewLocation(city, location);

      // respond
      res.status(200).json(location); // switch from .send to .json
    })
    .catch(err => {
      // .error() stands out
      console.error('Error occured in LOCATION', err);
    });
}

// Handlers
function locationHandler(req, res) {
  let key = process.env.GEOCODE_API_KEY;
  const city = req.query.city;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  if (city === '' || !city) {
    res.status(500).json('Sorry, something went wrong.');
  } else {
    checkLocation(city, url, res);
  }

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

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Now listening on port, ${PORT}`);
      console.log(`Connected to database: ${client.connectionParameters.database}`);
    });
  });
