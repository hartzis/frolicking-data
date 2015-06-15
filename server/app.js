'use strict'
let express = require('express');
let path = require('path');
let app = express();

// setup views and templates
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'jade');

// serve js and css from "public" directory
app.use(express.static(path.join(__dirname, '../client', 'public')));

app.get('/', function(req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'})
});

module.exports = app;