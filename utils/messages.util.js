const fs = require('fs')

const createMessage = (json) => {
    //TODO?: Save channel messages
    let body = JSON.parse(json)
    let username = body.username
    let message = body.message

    console.log(username + " said: " + message)
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