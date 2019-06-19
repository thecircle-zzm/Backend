const mongoose = require('mongoose')
const Schema = mongoose.Schema

var streamSchema = new Schema({
  sessionid: String,
  streamer: Object,
  stream: Object
})

const streamModel = mongoose.model('stream', streamSchema)

module.exports = {
  streamModel,
  streamSchema
}