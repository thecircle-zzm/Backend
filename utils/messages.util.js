const fs = require('fs')
const log = require('./logger.util')

const createMessage = (json) => {
    let body = JSON.parse(json)
    let username = body.username
    let message = body.message

    log('chat', username + " said: " + message)
    return body
}

const saveMessage = (username, message, fileName) =>  {
    fs.appendFile('./media/chat/' + fileName + '.txt', username + " said: " + message + '\n', (err) => {
        if(err) throw err
    })
}

module.exports = {
    createMessage,
    saveMessage,
}