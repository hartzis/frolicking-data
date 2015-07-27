let Frolicks = require('../models/frolicks');

const currentFrolicks = [
  {
    id: 1,
    name: 'munich'
  },
  {
    id: 2,
    name: 'paris'
  }
]

module.exports = {

  // get all the frolicks
  getAll(req, res) {
    Frolicks.find((err, allFrolicks)=>{
      res.send(allFrolicks);
    })
  },

}