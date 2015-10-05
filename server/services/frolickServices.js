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
  update(req, res) {
    let frolick = JSON.parse(req.body.json);
    console.log('updating-', frolick._id, 'with-', frolick);
    Frolicks.update({_id: frolick._id}, frolick, function(err){
      if(!err) {
        console.log('updated-', frolick._id);
        res.sendStatus(200);
      }
    })
  }

}
