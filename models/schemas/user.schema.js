const mongoose = require('mongoose')
const Schema = mongoose.Schema

var userSchema = new Schema({
    username: {
        type: String,
        unique: true // Unique index. If you specify `unique: true`
        // specifying `index: true` is optional if you do `unique: true`
      },
    email: String, 
    passwordHash:   {
      type: String,
      required: true // Unique index. If you specify `unique: true`
      // specifying `index: true` is optional if you do `unique: true`
    },
    passwordSalt:   {
      type: String,
      required: true // Unique index. If you specify `unique: true`
      // specifying `index: true` is optional if you do `unique: true`
    },
    publicKey:   String
})

const userModel = mongoose.model('user', userSchema)

module.exports = {
  userModel,
  userSchema
}