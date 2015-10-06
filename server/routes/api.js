let router = require('express').Router();
let frolickServices = require('../services/frolickServices');

let bodyParser = require('body-parser');

// parse application/json
router.use(bodyParser.json());

// middleware to use for all requests
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Methods');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

// # frolicks
router.get('/frolicks', frolickServices.getAll);
router.put('/frolicks/:frolickId', frolickServices.update);

module.exports = router;
