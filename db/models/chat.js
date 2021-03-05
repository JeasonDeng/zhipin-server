var mongoose = require('mongoose')
var Schema = mongoose.Schema

var chatSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  chat_id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  create_time: {
    type: Number,
  },
})
module.exports = mongoose.model('Chat', chatSchema)
