
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  return response.json()
}


let api = {

  getAll() {
    return fetch('/api/frolicks')
      .then(checkStatus)
      .then(parseJSON);
  },

  update(id, data) {
    console.log('data-', data);

    return fetch(`/api/frolicks/${id}`, {
      method: 'put',
      body: 'json=' + encodeURI(JSON.stringify(data)),
      headers: {
        // "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        'Content-type': 'application/x-www-form-urlencoded'
      },
    })
      .then(checkStatus)
      .then(()=>console.log('updated!!!'))
  },

  uploadImage(imageInfo) {
    return new Promise((resolve, reject) => {
      let imageFormData = new FormData();

      imageFormData.append('imageFile', imageInfo.imageFile);
      imageFormData.append('imageTitle', imageInfo.imageTitle);
      imageFormData.append('imageDate', imageInfo.imageDate);

      // return fetch('/upload', {
      //   method: 'post',
      //   data: imageFormData,
      //   credentials: 'same-origin',
      //   headers: {
      //     'Accept': 'application/json',
      //     'Content-Type': 'multipart/form-data; boundary=file',
      //     'Connection': 'keep-alive'
      //   },
      // })
      //   .then(checkStatus)
      //   .then(parseJSON)

      var xhr = new XMLHttpRequest();

      xhr.open('post', '/upload', true);

      xhr.onload = function () {
        if (this.status == 200) {
          // Performs the function "resolve" when this.status is equal to 200
          resolve(JSON.parse(this.response));
        } else {
          // Performs the function "reject" when this.status is different than 200
          reject(this.statusText);
        }
      };

      xhr.send(imageFormData);

    });

  }

}

module.exports = api;
