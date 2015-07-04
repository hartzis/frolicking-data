'use strict'
let app = require('./app');

let server = app.listen(3000, () => {

  let host = server.address().address;
  let port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

module.exports = server;