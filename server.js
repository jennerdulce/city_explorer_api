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
app.get('/movies', movieHandler);
app.get('/yelp', restaurantHandler);
app.use('*', catchAllHandler);

function addNewLocation(city, location) {
  const addLocationSQL = `INSERT INTO locations
                        (search_query, formatted_query, latitude, longitude)
                        VALUES ($1, $2, $3, $4)`;
  const safeValues = [location.search_query, location.formatted_query, location.latitude, location.longitude];

  client.query(addLocationSQL, safeValues);
}

// CHECK THE DATABASE
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

// RETRIEVE INFORMATION FROM API
function runLocationApi(city, url, res) {

  superagent.get(url)
    .then(data => {

      const locationData = data.body[0];
      const location = new Location(city, locationData);

      addNewLocation(city, location);
      console.log('TALKED TO DATABASE', location);

      res.status(200).json(location);
    })
    .catch(err => {
      console.error('Error occured in LOCATION', err);
    });
}

// HANDLERS / CONSTRUCTORS
function locationHandler(req, res) {
  let key = process.env.GEOCODE_API_KEY;
  const city = req.query.city; // only time hits city
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

  let key = process.env.WEATHERBIT_API_KEY;
  let currentLat = req.query.latitude;
  let currentLon = req.query.longitude;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?&lat=${currentLat}&lon=${currentLon}&key=${key}`;

  superagent.get(url)
    .then(response => {
      const weatherData = response.body.data;
      const weatherInfo = weatherData.map(value => {
        return new Weather(value); // return adds to the array
      });

      res.status(200).send(weatherInfo); // switch from .send to .json
    });
}

function Weather(data) {
  this.forecast = data.weather.description;
  this.time = new Date(data.datetime).toDateString();
}

function movieHandler(req, res) {
  const url = `https://api.themoviedb.org/3/search/movie`;
  let queryList = {
    api_key: process.env.MOVIES_API_KEY,
    query: req.query.search_query
  };

  superagent.get(url)
    .query(queryList)
    .then(data => {
      let moviesPromise = data.body.results.map( movies => {
        return new Movie(movies);
      });
      res.status(200).json(moviesPromise);
    })
    .catch((err) => {
      console.log(err);
    });
}


function Movie(data) {
  this.title = data.original_title;
  this.overview = data.overview;
  this.average_votes = data.vote_average;
  this.total_votes = data.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
  this.popularity = data.popularity;
  this.released_on = data.release_date;
}

function restaurantHandler(req, res){
  const numPerPage = 5;
  const page = req.query.page || 1;
  const start = ((page - 1) * numPerPage + 1);
  const url = `https://api.yelp.com/v3/businesses/search`;
  let queryList = {
    latitude: req.query.latitude,
    longitude: req.query.longitude,
    limit: numPerPage,
    offset: start
  };

  superagent.get(url)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`) // set is always for key HTTP Headers; meta data for request
    .query(queryList)
    .then(promise => {
      console.log(promise.body);
      let restauraunts = promise.body.businesses.map(value => {
        return new Yelp(value);
      });
      res.status(200).json(restauraunts);
    })
    .catch(err => {
      console.log(err);
    });
}

function Yelp(data){
  this.name = data.name;
  this.image_url = data.image_url;
  this.price = data.price;
  this.rating = data.rating;
  this.url = data.url;
}

function defaultHandler(req, res) {
  res.status(200).send('Hello World');
}

function catchAllHandler(req, res) {
  res.status(500).send('404. This Route Does Not Exist.');
}

// CONNECT TO THE SERVER
client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Now listening on port, ${PORT}`);
      console.log(`Connected to database: ${client.connectionParameters.database}`);
    });
  });
