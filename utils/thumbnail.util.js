var ffmpeg = require('fluent-ffmpeg')

let generateScreenshot = function (path, id) {
    ffmpeg('rtmp://localhost/' + path)
        .outputOptions(['-f image2',
            '-vframes 1',
            '-vcodec png',
            '-f rawvideo',
            '-s 1280x720',
            '-ss 00:00:01'
        ])
        .output('media/thumbnails/' + id + '.png')
        .run()
}

module.exports = {
    generateScreenshot
}