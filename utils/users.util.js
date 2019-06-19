const fs = require('fs')
const users = []

const addUser = ( id, username, room ) => {
    //TODO?: Add digital signature check
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'User already in room!'
        }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

const createFile = (id) => {
    fs.appendFile('./media/chat/' + id + '.txt', 'Begin of Chat from: ' + id + "'s stream." + " Chat started on: " + new Date().toISOString() +'\n', (err) => {
        if(err) throw err
        console.log('Chat file created.')
    })

    return(id + '.txt')
}

const findStreamer = () => {
    return(users[0].username)
    
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    createFile,
    findStreamer
}