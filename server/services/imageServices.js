let multiparty = require('multiparty');
let fs = require('fs');

function saveImage(req, res) {
  let form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    console.log('err-', err, 'fields-', fields, 'files-', files);
    let imageFile = files.imageFile[0];
    console.log('imageInfo-', imageFile);

    let tmpPath = imageFile.path;
    let newPath = "./images/" + imageFile.originalFilename;

    fs.readFile(tmpPath, (err, data) => {
      if (err) throw err;
      fs.writeFile(newPath, data, (err) => {
        fs.unlink(tmpPath, () => {
          if(err) throw err;
          res.send("File uploaded to: " + newPath);
        });
      }); 
    }); 


  })
}


module.exports = {
  saveImage
}