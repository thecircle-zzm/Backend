const NodeMediaServer = require('node-media-server')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
var crypto = require('crypto')

const User = require('../models/schemas/user.schema.js').userModel
const Stream = require('../models/schemas/stream.schema').streamModel

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 8000,
        mediaroot: './media',
        allow_origin: '*'
    },
    trans: {
        ffmpeg: ffmpegPath,
        tasks: [{
            app: 'live',
            mp4: true,
            mp4Flags: '[movflags=faststart]',
        }]
    },
    auth: {
        api: true,
        api_user: 'zzm',
        api_pass: 'PSRwF6PBbmPrZxZaJQ86uSQfFM'
    }
}

// Start Node Media Server
var nms = new NodeMediaServer(config)
nms.run()

// Empty Stream collection
emptyCollection()

nms.on('prePublish', (id, StreamPath) => {

    // Get session from nms
    let session = nms.getSession(id)
    let s2 = session.publishStreamPath

    // Hash Streamkey
    let hashedStreamKey = crypto.createHash('sha256').update(s2).digest("hex")

    // Get Streamkey from Stream Path
    let currentStreamKey = getStreamKeyFromStreamPath(StreamPath)

    User.findOne({
        streamingKey: currentStreamKey
    }, (err, luser) => {

        if (!err) {

            // If user does not exists or invalid streamkey
            if (!luser) {
                // Kick the session
                session.reject()
            } 
            
            // Else save the session
            else {

                // Create object
                let s = {
                    sessionid: id,
                    streamer: {
                        username: luser.username,
                        email: luser.email,
                    },
                    stream: {
                        path: session.publishStreamPath,
                        thumbnail: '/thumbnails/' + hashedStreamKey + '.png'
                    }
                }

                // Save Stream
                let stream = new Stream(s)
                stream.save()

                // Create a thumbnail
                require('../utils/thumbnail.util').generateScreenshot(session.publishStreamPath, hashedStreamKey)
            }
        }

    })

    // Set the public streaming path to a hashed value of the streamkey
    session.publishStreamPath = '/live/' + hashedStreamKey
})

nms.on('donePublish', (id) => {
    Stream.deleteOne({sessionid: id}, function (error, result) {
        console.log(result)
    })
})

const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/')
    return parts[parts.length - 1]
}

function emptyCollection() {
    Stream.deleteMany({}, error => {
        if (error) {
            console.log(error)
        } else {
            console.log("Stream collection has been emptied")
        }
    })
}