/* eslint-disable no-console */
const NodeMediaServer = require('node-media-server')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
var crypto = require('crypto')

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

    const loginUser = 'test'
    const loginPassword = 'password'

    lUser.findOne({
            userName: loginUser
        })
        .then((err, luser) => {
            if (!luser) {
                /*
                res.status(403).send({
                    Error: "User does not exist!"
                })
                */
                session.reject() // if user does not exist, reject the session immediately!
            } else if(err){
                console.log(err)
                session.reject()
             } else {  
                 if(!luser.validPassword(loginPassword)){
                    session.reject()
                 }
                 //We can continue
            }
        })
        .catch()
})

nms.on('prePublish', (id, StreamPath, args) => {
    let session = nms.getSession(id)
    let s2 = session.publishStreamPath

    let currentStreamKey = getStreamKeyFromStreamPath(StreamPath);

    lUser.findOne({streamingKey: currentStreamKey}, (err, luser) => {
        if (!err) {
            if (!luser) {
                session.reject(); //Kick invalid stream key
            } else {
                // do stuff
            }
        }
    });

    session.publishStreamPath = '/live/' + crypto.createHash('sha256').update(s2).digest("hex")
})

const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};