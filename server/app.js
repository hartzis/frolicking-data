'use strict'
let express = require('express');
let path = require('path');
let app = express();

app.set('views', path.join(__dirname, './views'));

app.use(express.static(path.join(__dirname, '../client', 'public')));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

module.exports = app;