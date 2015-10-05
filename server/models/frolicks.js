let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let frolickSchema = new Schema({

  filename: {type: String, default: ''},
  title: {type: String, default: ''},
  date: {type: Date, default: Date.now},
  description: {type: String, default: ''},
  story: {type: String, default: ''},
  tags: [String],
  location: {
    lat: {type: Number, default: 0},
    lng: {type: Number, default: 0},
    city: {type: String, default: ''},
    state: {type: String, default: ''},
    country: {type: String, default: ''}
  },
  heelClicked: {type: Boolean, default: false},
  midAir: {type: Boolean, default: false},
  hasHat: {type: Boolean, default: false},
  hasOtherPeople: {type: Boolean, default: false},
  otherPeople: [String]


});

module.exports = mongoose.model('Frolick', frolickSchema);
