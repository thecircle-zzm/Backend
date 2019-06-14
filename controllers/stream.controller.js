const Stream = require('../models/schemas/stream.schema').streamModel

let getAllStreams = (req, res) => {
  Stream.find({}, (error, streams) => {
    if (error) {
      res.status(500).json(error).end()
    } else {
      res.status(200).json(streams).end()
    }
  })
}

module.exports = {
  getAllStreams
}