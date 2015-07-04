'use strict'
let express = require('express');
let path = require('path');
let app = express();
let routes = require('./routes/api');

// setup views and templates
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'jade');

// serve js and css from "public" directory
app.use(express.static(path.join(__dirname, '../client/public')));

app.use('/api', routes);

app.get('/', (req, res) => {
  console.log('loading index file');
  res.render('index');
  return;
});

module.exports = app;