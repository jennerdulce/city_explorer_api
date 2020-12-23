'use strict';

// Imported Modules
// Ensure to install VIA terminal
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Set up a few things with modules
// Create instance of express
const app = express();

// Create port connection
const PORT = process.env.PORT;

// Create a few Requests

// Default
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Catach All
app.use('*', (req, res) => {
  res.send('This is a CatchAll');
});

// .listen() to deploy server.
// node server.js in terminal
app.listen(PORT, () => {
  console.log(`Now listening on port, ${PORT}`);
});

