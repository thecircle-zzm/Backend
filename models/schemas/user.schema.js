const mongoose = require('mongoose')
const Schema = mongoose.Schema

var userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email: String,
  publicKey: String, //save public key in x509 format with \n or \r escape characters!
  tokens: { type: Number, default: 0 },
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