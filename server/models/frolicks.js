let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let frolickSchema = new Schema({

  title: String,
  date: Date,
  story: String,
  tags: [String],
  location: {
    lat: Number,
    long: Number,
    city: String,
    state: String,
    country: String
  },
  clicked: Boolean,
  otherPeople: [String],
  hasHat: Boolean

});

module.exports = mongoose.model('Frolick', frolickSchema);