var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 设计 Schema (约束)
var userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  post: {
    type: String,
  },
  avatar: {
    type: String,
  },
  company: {
    type: String,
  },
  salary: {
    type: String,
  },
  info: {
    type: String,
  },
})

module.exports = mongoose.model('User', userSchema)
