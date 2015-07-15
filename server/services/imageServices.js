let Frolicks = require('../models/frolicks');
let multiparty = require('multiparty');
let fs = require('fs');
let moment = require('moment');
let lwip = require('lwip');
let imagesConfig = require('../imagesConfig');



function copyImageToNewFormat(imagePath, newImageFormat, newImageExt, descriptor) {
  
  // i realize this isn't good
  // need to find better way to edit/split/create paths
  let [,imagePathNoExt,] = imagePath.split('.');
  imagePathNoExt = '.' + imagePathNoExt;
  let newImagePath = imagePathNoExt + '-' + descriptor + '.' + newImageExt;

  return new Promise((resolve)=>{
    lwip.open(imagePath, (err, image)=>{
      image.batch().writeFile(newImagePath, newImageFormat, (err)=>{
        if (err) throw err;
        resolve();
      });
    })
  })
}

function cropAndCreateNewImage(width, height, imagePath, descriptor) {

  let [,imagePathNoExt, ext] = imagePath.split('.');
  imagePathNoExt = '.' + imagePathNoExt;
  let newImagePath = imagePathNoExt + '-' + descriptor + '.' + ext;

  return new Promise((resolve)=>{
    lwip.open(imagePath, (err, image)=>{
      image.batch()
        .cover(width, height)
        .writeFile(newImagePath, (err)=>{
          if (err) throw err;
          resolve();
        });
    })
  })
}

function resizeAndCreateNewImage(width, height, imagePath, descriptor) {

  let [,imagePathNoExt, ext] = imagePath.split('.');
  imagePathNoExt = '.' + imagePathNoExt;
  let newImagePath = imagePathNoExt + '-' + descriptor + '.' + ext;

  return new Promise((resolve)=>{
    lwip.open(imagePath, (err, image)=>{
      image.batch()
        .resize(width, height)
        .writeFile(newImagePath, (err)=>{
          if (err) throw err;
          resolve();
        });
    })
  })
}

function createFrolickandMoveAndRenameImage(newFrolickData, tmpPath, newPath) {
  return new Promise((resolve)=>{
    Frolicks.create(newFrolickData, (err, newFrolick)=>{
      fs.readFile(tmpPath, (err, data)=>{
        if (err) throw err;
        fs.writeFile(newPath, data, (err)=>{
          fs.unlink(tmpPath, ()=>{
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

  form.parse(req, (err, fields, files)=>{
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
        copyImageToNewFormat(newPath, imagesConfig.TheNewImageFormat, imagesConfig.TheNewImageExt, 'orig')
          .then(()=>{
            res.send('it worked');
          })
      })
      .catch((error)=>console.log('error processing-', error))

  })
}


module.exports = {
  saveImage
}