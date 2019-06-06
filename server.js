const NodeMediaServer = require('node-media-server');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var crypto = require('crypto');

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
      secret: '1337privatekey6666'
    }
};

var nms = new NodeMediaServer(config)
nms.run();

nms.on('preConnect', (id, args) => {
    //console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
    // let session = nms.getSession(id);
    // session.reject();
  });
  
  nms.on('postConnect', (id, args) => {
    //console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
  });
  
  nms.on('doneConnect', (id, args) => {
    //console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
  });

 

  
  nms.on('prePublish', (id, StreamPath, args) => {

    let session = nms.getSession(id);

    console.dir(session)

    let s2 = session.publishStreamPath;

    session.publishStreamPath = '/live/' + crypto.createHash('md5').update(s2).digest("hex");

  });
  
  nms.on('postPublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  });
  
  nms.on('donePublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  });

  //event handlers

  nms.on('prePlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // let session = nms.getSession(id);
    // session.reject();
  });
  
  nms.on('postPlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  });
  
  nms.on('donePlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  });
