let Frolicks = require('../models/frolicks');
let multiparty = require('multiparty');
let fs = require('fs');
let moment = require('moment');

let promiseSeries = require('../utils/promise-series');

let lwip = require('lwip');
let imagesConfig = require('../imagesConfig');
let {ImageSizes} = imagesConfig;

function getBasePathBaseFileNameExt(fullImagePath) {
  let splitPath = fullImagePath.split('/');
  let fileWithExt = splitPath.pop();
  let basePath = splitPath.join('/');
  console.log(splitPath, fileWithExt, basePath);
  let [filename, extension] = fileWithExt.split('.');
  let [basefilename,] = filename.split('-');
  return {basePath, basefilename, extension}
}

function copyImageToNewFormat(imagePath, newImageFormat, newImageExt, descriptor) {

  let {basePath, basefilename} = getBasePathBaseFileNameExt(imagePath);
  let newImagePath = basePath + '/' + descriptor + '/' + basefilename + '-' + descriptor + '.' + newImageExt;

  return new Promise((resolve)=>{
    lwip.open(imagePath, (err, image)=>{
      image.batch().writeFile(newImagePath, newImageFormat, (err)=>{
        if (err) throw err;
        resolve(newImagePath);
      });
    })
  })
}

function coverNewImage(width, height, imagePath, descriptor) {

  let [,imagePathNoExt, ext] = imagePath.split('.');
  imagePathNoExt = '.' + imagePathNoExt;
  let newImagePath = imagePathNoExt + '-' + descriptor + '.' + ext;

  return new Promise((resolve)=>{
    lwip.open(imagePath, (err, image)=>{
      image.batch()
        .cover(width, height)
        .writeFile(newImagePath, (err)=>{
          if (err) throw err;
          resolve(newImagePath);
        });
    })
  })
}

function resizeNewImage(width, height, imagePath, descriptor) {

  let [,imagePathNoExt, ext] = imagePath.split('.');
  imagePathNoExt = '.' + imagePathNoExt;
  let newImagePath = imagePathNoExt + '-' + descriptor + '.' + ext;

  return new Promise((resolve)=>{
    lwip.open(imagePath, (err, image)=>{
      image.batch()
        .resize(width, height)
        .writeFile(newImagePath, (err)=>{
          if (err) throw err;
          resolve(newImagePath);
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
          .then((origImagePath)=>{
            
            let med = ImageSizes.medium;
            let mediumImage = coverNewImage(med.width, med.height, origImagePath, 'medium');
            let small = ImageSizes.small;
            let smallImage = coverNewImage(small.width, small.height, origImagePath, 'small');

            promiseSeries([mediumImage, smallImage])
              .then((newImagePaths)=>{
                console.log('newImagePaths-', newImagePaths);
                let thumb = ImageSizes.thumbnail;
                resizeNewImage(thumb.width, thumb.width, newImagePaths[0], 'thumbnail')
                  .then(()=>{
                    res.send('it worked');        
                  })
                  .catch(logError)
              })
              .catch(logError)

          })
          .catch(logError)
      })
      .catch(logError)

  })
}

function logError(error) {
  return console.log('error processing-', error);
}

module.exports = {
  saveImage
}