const NodeMediaServer = require('node-media-server')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
var crypto = require('crypto')

const mongoose = require('mongoose')
const userSM = require('../models/schemas/user.schema.js')
const lUser = userSM.userModel

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

var nms = new NodeMediaServer(config)
nms.run()

nms.on('preConnect', (id, args) => {
    console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`)
    let session = nms.getSession(id)

    
})

nms.on('prePublish', (id, StreamPath, args) => {
    let session = nms.getSession(id)
    let s2 = session.publishStreamPath

    let currentStreamKey = getStreamKeyFromStreamPath(StreamPath);

    lUser.findOne({streamingKey: currentStreamKey}, (err, luser) => {
        if (!err) {
            if (!luser) {
                session.reject() //Kick invalid stream key
            } 
        }
});

    session.publishStreamPath = '/live/' + crypto.createHash('sha256').update(s2).digest("hex")
})

const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/')
    return parts[parts.length - 1]
};