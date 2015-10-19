let Frolicks = require('../models/frolicks');
let _ = require('lodash');
let moment = require('moment');

module.exports = {

  // get all the frolicks
  getAll(req, res) {
    Frolicks.find((err, allFrolicks)=>{
      let tags = collectTags(allFrolicks);
      res.send({
        frolicks: allFrolicks,
        tags
      });
    })
  },
  update(req, res) {
    let frolick = req.body;
    console.log('updating-', frolick._id, 'with-', frolick);
    // fix date formate, boo
    frolick.date = new Date(moment(frolick.date).format())
    Frolicks.update({_id: frolick._id}, frolick, function(err){
      if(!err) {
        console.log('updated-', frolick._id);
        res.sendStatus(200);
      }
    })
  }

}

function collectTags(frolicks) {
  return _.chain(frolicks)
    .reduce((result, val, key)=>{
        val.tags.forEach((tag)=>{
          if (!result[tag]) {
            result[tag] = tag;
          }
        })
        return result;
      }, {})
    .map((val, key)=>{return val});
}
