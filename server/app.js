'use strict'
let express = require('express');
let path = require('path');
let app = express();
let routes = require('./routes/api');

let mongoose = require('mongoose');
var mongoDatabase = 'mongodb://localhost/frolicks';
mongoose.connect(mongoDatabase);

let imageServices = require('./services/imageServices');

// setup views and templates
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'jade');

// serve js and css from "public" directory
app.use(express.static(path.join(__dirname, '../client/public')));

// where images are saved
app.use('/images', express.static(path.join(__dirname, '../images')));

app.use('/api', routes);

app.get('/', (req, res) => {
  console.log('loading index file');
  return res.render('index');
});

app.get('/upload', (req, res) => {
  return res.render('uploadImage');
});

app.post('/upload', imageServices.saveImage);

module.exports = app;