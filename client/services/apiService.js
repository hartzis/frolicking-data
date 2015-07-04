
let api = {

  getAll() {
    return fetch('/api/frolicks')
      .then(response=>response.json());
  }

}

module.exports = api;