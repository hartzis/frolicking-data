let multiparty = require('multiparty');

function saveImage(req, res) {
  let form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    let imageFile = files.imageFile[0];
    console.log('parse-', err, fields, imageFile);
    res.send('Name: ' + imageFile.originalFilename);
  })
}


module.exports = {
  saveImage
}