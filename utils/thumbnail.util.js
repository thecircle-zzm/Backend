let ffmpeg = require('fluent-ffmpeg')
let fs = require('fs')

let generateScreenshot = function (path, id) {
    if (path !== '') {
        ffmpeg('rtmp://localhost/' + path)
            .outputOptions([
                '-f image2',
                '-vframes 1',
                '-vcodec png',
                '-f rawvideo',
                '-s 1280x720',
                '-ss 00:00:01'
            ])
            .output('media/thumbnails/' + id + '.png')
            .run()
        console.log('[SCREENSHOT] - media/thumbnails/' + id + '.png')
    }
}

let removeScreenshot = function (id) {
    let path = 'media/thumbnails/' + id + '.png'
    fs.unlink(path, (error) => {
        if (error) console.log(error)
    })
}

module.exports = {
    generateScreenshot,
    removeScreenshot
}