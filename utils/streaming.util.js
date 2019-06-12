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
        api_pass: 'zzm123'
    }
}

var nms = new NodeMediaServer(config)
nms.run()

// --------------------------------
// password hash functions
// --------------------------------

let sha512 = function (password, salt) {
    let hash = crypto.createHmac('sha512', salt) /** Hashing algorithm sha512 */
    hash.update(password)
    let value = hash.digest('hex')
    return {
        salt: salt,
        passwordHash: value
    }
}

function comparePasswordHash(userpassword, loginUser, session) {
    let salt = loginUser.passwordSalt
    let passwordData = sha512(userpassword, salt)
    console.log('UserPassword = ' + userpassword)
    console.log('Passwordhash = ' + passwordData.passwordHash)
    console.log('nSalt = ' + passwordData.salt)

    if (passwordData.passwordHash == loginUser.passwordHash) {
        console.log('Passwords match')
    } else {
        /*
        res.status(401).send({
            Error: "Login error"
        })
        */
        session.reject()
    }
}

nms.on('preConnect', (id, args) => {
    console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`)
    let session = nms.getSession(id)

    const loginUser = 'test'
    const loginPassword = 'password'

    lUser.findOne({
            userName: loginUser
        })
        .then((luser) => {
            if (luser === null) {
                /*
                res.status(403).send({
                    Error: "User does not exist!"
                })
                */
                session.reject() // if user does not exist, reject the session immediately!
            } else {  
                comparePasswordHash(loginPassword, luser, session) /* input password, loginUser, session */
            }
        })
        .catch()
})

nms.on('prePublish', (id, StreamPath, args) => {
    let session = nms.getSession(id)
    let s2 = session.publishStreamPath
    session.publishStreamPath = '/live/' + crypto.createHash('sha256').update(s2).digest("hex")
})