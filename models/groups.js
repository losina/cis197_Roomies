const mongoose = require('mongoose');

var groupSchema = new mongoose.Schema({
  groupName: { type: String },
  members: [String],
  description: String,
  todos: [{"todoText": String}]
})

module.exports = mongoose.model('Group', groupSchema);
