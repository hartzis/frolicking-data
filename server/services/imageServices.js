let Frolicks = require('../models/frolicks');
let multiparty = require('multiparty');
let fs = require('fs');
let moment = require('moment');

let promiseSeries = require('../utils/promise-series');

let lwip = require('lwip');
let imagesConfig = require('../imagesConfig');
let {ImageSizes} = imagesConfig;

function getBasePathBaseFileNameExt(fullImagePath, hasDescriptor) {
  let splitPath = fullImagePath.split('/');
  let fileWithExt = splitPath.pop();
  if (hasDescriptor) splitPath.pop();
  let basePath = splitPath.join('/');
  console.log(splitPath, fileWithExt, basePath);
  let [filename, extension] = fileWithExt.split('.');
  let [basefilename,] = filename.split('-');
  return {basePath, basefilename, extension}
}

function getImagePathWithDescExt(basePath, basefilename, descriptor, extension) {
  return basePath + '/' + descriptor + '/' + basefilename + '-' + descriptor + '.' + extension;
}

function copyImageToNewFormat(imagePath, newImageFormat, newImagePath) {

  return new Promise((resolve)=>{
    lwip.open(imagePath, (err, image)=>{
      image.batch().writeFile(newImagePath, newImageFormat, (err)=>{
        if (err) throw err;
        resolve(newImagePath);
      });
    })
  })
}

function coverNewImage(width, height, srcImagePath, destImagePath) {

  return new Promise((resolve)=>{
    lwip.open(srcImagePath, (err, image)=>{
      image.batch()
        .cover(width, height)
        .writeFile(destImagePath, (err)=>{
          if (err) throw err;
          resolve(destImagePath);
        });
    })
  })
}

function resizeNewImage(width, height, srcImagePath, destImagePath) {

  return new Promise((resolve)=>{
    lwip.open(srcImagePath, (err, image)=>{
      image.batch()
        .resize(width, height)
        .writeFile(destImagePath, (err)=>{
          if (err) throw err;
          resolve(destImagePath);
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
            resolve(newFrolick);
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

    let newPath = "./images/main/" + newFileName;

    let newFrolickData = {
      filename: newFileName,
      title: imageTitle,
      date: new Date(moment(imageDate).format())
    }

    createFrolickandMoveAndRenameImage(newFrolickData, tmpPath, newPath)
      .then((newFrolickData)=>{

        let getAllFrolicks = new Promise((resolve)=>{
          Frolicks.find((err, allFrolicks)=>{
            resolve(allFrolicks);
          });
        });

        let {basePath: origBasePath, basefilename: origBaseFilename} = getBasePathBaseFileNameExt(newPath, true);
        let newOrigImagePath = getImagePathWithDescExt(origBasePath, origBaseFilename, 'orig', imagesConfig.TheNewImageExt);

        copyImageToNewFormat(newPath, imagesConfig.TheNewImageFormat, newOrigImagePath)
          .then((newSavedOrigImagePath)=>{
            
            let large = ImageSizes.large;
            let med = ImageSizes.medium;
            let small = ImageSizes.small;
            
            // setup medium and small image output paths
            let {basePath: newSavedOrigBasePath, basefilename: newSavedOrigBaseFilename} = getBasePathBaseFileNameExt(newSavedOrigImagePath, true);
            let largeImagePath = getImagePathWithDescExt(newSavedOrigBasePath, newSavedOrigBaseFilename, large.name, imagesConfig.TheNewImageExt);
            let mediumImagePath = getImagePathWithDescExt(newSavedOrigBasePath, newSavedOrigBaseFilename, med.name, imagesConfig.TheNewImageExt);
            let smallImagePath = getImagePathWithDescExt(newSavedOrigBasePath, newSavedOrigBaseFilename, small.name, imagesConfig.TheNewImageExt);

            // Create large, medium and small images
            let largeImage = coverNewImage(large.width, large.height, newSavedOrigImagePath, largeImagePath);
            let mediumImage = coverNewImage(med.width, med.height, newSavedOrigImagePath, mediumImagePath);
            let smallImage = coverNewImage(small.width, small.height, newSavedOrigImagePath, smallImagePath);

            promiseSeries([largeImage, mediumImage, smallImage])
              .then((newImagePaths)=>{
                console.log('largeMedSmallImagePaths-', newImagePaths);
                let makeThumbFromThisImage = newImagePaths[1];
                let thumb = ImageSizes.thumbnail;
                
                let {basePath: newSavedSrcBasePath, basefilename: newSavedSrcBaseFilename} = getBasePathBaseFileNameExt(makeThumbFromThisImage, true);
                let thumbImagePath = getImagePathWithDescExt(newSavedSrcBasePath, newSavedSrcBaseFilename, thumb.name, imagesConfig.TheNewImageExt);

                // Create thumbnail from medium sized image
                resizeNewImage(thumb.width, thumb.height, makeThumbFromThisImage, thumbImagePath)
                  .then(()=>{

                    // send back all frolicks, and the most recently saved one
                    getAllFrolicks.then((allFrolicks)=>{
                      res.send({allFrolicks, savedFrolick: newFrolickData});
                    })
                    
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