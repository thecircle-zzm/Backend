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
    let hashedStreamKey = crypto.createHash('sha256').update(s2).digest('hex')

    // Get Streamkey from Stream Path
    let currentStreamKey = getStreamKeyFromStreamPath(StreamPath)

    // Set the public streaming path to a hashed value of the streamkey
    session.publishStreamPath = '/live/' + hashedStreamKey

    // Check if the stream key is already in use
    Stream.findOne({
        'stream.key': hashedStreamKey
    }, (error, stream) => {

        // If streamkey is already in use, reject the session
        if (stream) {
            session.reject()
        }

        // Start the session
        else {

            // Check if a user exists with the specified streamkey
            User.findOne({
                streamingKey: currentStreamKey
            }, (err, luser) => {

                if (!err) {

                    // If user does not exists or invalid streamkey, kick the session
                    if (!luser) {
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
                                tokens: luser.tokens
                            },
                            stream: {
                                key: hashedStreamKey,
                                path: session.publishStreamPath,
                                thumbnail: '/thumbnails/' + hashedStreamKey + '.png'
                            }
                        }

                        // Keep track of the user
                        session.user = luser

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

                        // Award a token every 60 seconds
                        let tokenGeneration = cron.schedule('* * * * *', () => {
                            User.findOne({
                                username: s.streamer.username
                            }, (error, user) => {
                                if (error) {
                                    console.log(error)
                                } else {
                                    console.log('[TOKEN] - A token was rewarded to ' + user.username)
                                    let tokens = user.tokens
                                    user.tokens = ++tokens
                                    user.save()
                                }
                            })
                        }, {
                            scheduled: false
                        })

                        // Start the tasks
                        task.start()
                        tokenGeneration.start()

                        // Save tasks in the session so we can stop it later
                        session.task = task
                        session.tokenGeneration = tokenGeneration

                        // Log info
                        console.log('[STREAM] - ' + session.user.username + ' started streaming on: ' + session.publishStreamPath)

                    }
                }
            })
        }
    })
})

nms.on('donePublish', (id) => {

    // Remove Stream from collection
    Stream.deleteOne({
        sessionid: id
    }, (error, stream) => {
        if (error) {
            console.log(error)
        } else {
            // Log info
            console.log('[STREAM] - ' + stream.streamer.username + ' has stoped streaming')
        }
    })

    // Get session from nms
    let session = nms.getSession(id)

    // Remove thumbnail
    Thumbnail.removeScreenshot(session.hashedStreamKey)

    // Stop Cron jobs
    session.task.stop()
    session.tokenGeneration.stop()
})

nms.on('postPlay', (id, StreamPath, args) => {})

nms.on('donePlay', (id, StreamPath, args) => {})

const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/')
    return parts[parts.length - 1]
}

function emptyCollection() {
    Stream.deleteMany({}, error => {
        if (error) {
            console.log(error)
        } else {
            console.log('Stream collection has been emptied')
        }
    })
}