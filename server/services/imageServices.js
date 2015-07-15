let Frolicks = require('../models/frolicks');
let multiparty = require('multiparty');
let fs = require('fs');
let moment = require('moment');

function createFrolickandMoveAndRenameImage(newFrolickData, tmpPath, newPath) {
  return new Promise((resolve)=>{
    Frolicks.create(newFrolickData, (err, newFrolick) => {
      fs.readFile(tmpPath, (err, data) => {
        if (err) throw err;
        fs.writeFile(newPath, data, (err) => {
          fs.unlink(tmpPath, () => {
            if(err) throw err;
            resolve();
          });
        }); 
      });
    })
  })
}

function saveImage(req, res) {
  let form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    let imageFile = files.imageFile[0];
    let imageTitle = fields.imageTitle[0];
    let imageDate = fields.imageDate[0];

    let tmpPath = imageFile.path;
    let [originalFilename, origExt] = imageFile.originalFilename.split('.');

    let newFileName = imageDate.replace(/-/g, '') + imageTitle.replace(/ /g, '') + '.' + origExt;

    let newPath = "./images/" + newFileName;

    let newFrolickData = {
      filename: newFileName,
      title: imageTitle,
      date: new Date(moment(imageDate).format())
    }

    createFrolickandMoveAndRenameImage(newFrolickData, tmpPath, newPath)
      .then(()=>{
        res.send('it worked');
      })

  })
}


module.exports = {
  saveImage
}