var mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {type: String},
  username: { type: String },
  password: { type: String },
  group: [String],
  requests: [{"friendName" : String, "groupName" : String}]
})

module.exports = mongoose.model('User', userSchema);