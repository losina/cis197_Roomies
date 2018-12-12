var mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
  description: String,
  contact_info: String,
  lat: Number,
  lng: Number,
  geo_name: String
})

module.exports = mongoose.model('Place', locationSchema);