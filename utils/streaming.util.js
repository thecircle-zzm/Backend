const NodeMediaServer = require('node-media-server')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
var crypto = require('crypto')
var cron = require('node-cron');

const Thumbnail = require('../utils/thumbnail.util')
const User = require('../models/schemas/user.schema.js').userModel
const Stream = require('../models/schemas/stream.schema').streamModel

const config = {
    logType: 1,
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

                // Save hashed streamkey in the session
                session.hashedStreamKey = hashedStreamKey

                // Create a thumbnail
                Thumbnail.generateScreenshot(session.publishStreamPath, hashedStreamKey)

                // Generate a thumbnail every 60 seconds
                let task = cron.schedule('* * * * *', () => {
                    Thumbnail.generateScreenshot(session.publishStreamPath, hashedStreamKey)
                }, {
                    scheduled: false
                })

                // Start the task
                task.start()

                // Save task in the session so we can stop it later
                session.task = task

            }
        }

    })

    // Set the public streaming path to a hashed value of the streamkey
    session.publishStreamPath = '/live/' + hashedStreamKey

    // Log info
    console.log("New stream: " + session.publishStreamPath)

})

nms.on('donePublish', (id) => {

    // Remove Stream from collection
    Stream.deleteOne({
        sessionid: id
    })

    // Get session from nms
    let session = nms.getSession(id)

    // Remove thumbnail
    Thumbnail.removeScreenshot(session.hashedStreamKey)

    // Stop thumbnail generation cron
    session.task.stop()
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