const Stream = require('../models/schemas/stream.schema').streamModel
const Users = require('../utils/users.util')

let getAllStreams = (req, res) => {
  Stream.find({}, (error, streams) => {
    if (error) {
      res.status(500).json(error).end()
    } else {
      res.status(200).json(streams).end()
    }
  })
}

let getViewerCount = (req, res) => {
  let room = req.params.session
  res.status(200).json({viewercount: Users.viewerCount(room)})
}

module.exports = {
  getAllStreams,
  getViewerCount
}