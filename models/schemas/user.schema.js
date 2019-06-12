const mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;


var userSchema = new Schema({
    username: {
        type: String,
        unique: true
      },
    email: {
      type: String,
      unique: true
    },
    passwordHash: String,
    streamingKey: String,
    publicKey:   String
})

userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateStreamKey = () => {
  return crypto.randomBytes(Math.ceil(length / 2))
  .toString('hex') /** convert to hex */
  .slice(0, 16) /** return required num of char */
};

const userModel = mongoose.model('user', userSchema)

module.exports = {
  userModel,
  userSchema
}