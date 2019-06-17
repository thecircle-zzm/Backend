const mongoose = require('mongoose')
const Schema = mongoose.Schema

var userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email: String,
  passwordHash: {
    type: String,
    required: true
  },
  passwordSalt: {
    type: String,
    required: true
  },
  publicKey: String,
  streamingKey: {
    type: String,
    required: true
  }
})

const userModel = mongoose.model('user', userSchema)

module.exports = {
  userModel,
  userSchema
}