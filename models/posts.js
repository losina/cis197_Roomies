var mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  postTitle: {type: String},
  postText: { type: String },
  author: { type: String },
  comments: [String],
  group: {type: String}
})

module.exports = mongoose.model('Post', postSchema);