let router = require('express').Router();
let frolickServices = require('../services/frolickServices');

// middleware to use for all requests
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Methods');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

router.get('/frolicks', frolickServices.getAll);

// # frolicks
// router.post '/frolicks', frolicks.create
// router.get '/frolicks', frolicks.findAll
// router.get '/frolicks/:frolickId', frolicks.find
// router.put '/frolicks/:frolickId', frolicks.update
// router.put '/frolicks/updateByName/:name', frolicks.updateByName

module.exports = router;