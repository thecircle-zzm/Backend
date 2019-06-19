const User = require('../models/schemas/user.schema').userModel

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
                    streamingKey: user.streamingKey
                }).end()
            }
        })
    }

}

module.exports = {
    getStreamkeyByUsername
}