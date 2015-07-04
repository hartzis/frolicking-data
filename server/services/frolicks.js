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
    res.send(currentFrolicks);
  },

}