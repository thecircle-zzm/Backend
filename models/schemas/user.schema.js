const mongoose = require('mongoose')
const Schema = mongoose.Schema

var userSchema = new Schema({
    userName: {
        type: String,
        index: true,
        unique: true // Unique index. If you specify `unique: true`
        // specifying `index: true` is optional if you do `unique: true`
      },
    eMail: String,
    passwordHash:   String,
    passwordSalt:   String,
    publicKey:   String
})

const userModel = mongoose.model('user', userSchema)

module.exports = {
  userModel,
  userSchema
}