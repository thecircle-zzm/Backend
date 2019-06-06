const NodeMediaServer = require('node-media-server')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
var crypto = require('crypto')

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
        play: true,
        publish: true,
        secret: '1337privatekey6666',
        api: true,
        api_user: 'zzm',
        api_pass: 'zzm123'
    }
};

var nms = new NodeMediaServer(config)
nms.run();

nms.on('prePublish', (id, StreamPath, args) => {
    let session = nms.getSession(id)
    let s2 = session.publishStreamPath
    session.publishStreamPath = '/live/' + crypto.createHash('md5').update(s2).digest("hex")
});