const User = require('../models/schemas/user.schema').userModel
const crypto = require('crypto')

let getStreamkeyByUsername = (req, res) => {

    let username = req.params.username || ''

    if (username == '') {
        res.status(413).end()
    } else {
        User.findOne({ username: username }, (error, user) => {
            if (error) {
                res.status(500).json(error).end()
            } else {
                res.status(200).json({
                    username: user.username,
                    streamingKey: user.streamingKey, // For backwards compatibility
                    streaming: {
                        protocol: "rtmp",
                        domain: "188.166.38.127",
                        port: 1935,
                        appName: "live",
                        streamName: user.streamingKey
                    },
                    chats: {
                        protocol: "http",
                        domain: "188.166.38.127",
                        port: 5000,
                        room: crypto.createHash('sha256').update("/live/" + user.streamingKey).digest('hex')
                    }
                }).end()
            }
        })
    }

}

module.exports = {
    getStreamkeyByUsername
}