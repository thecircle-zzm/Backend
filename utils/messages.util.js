const createMessage = (json) => {
    console.log('Json: ' + json)
    let body = JSON.parse(json)
    let username = body.username
    let message = body.message

    console.log(username + " said: " + message)
    console.log(json)
    return body
}

module.exports = {
    createMessage
}