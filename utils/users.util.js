const users = []

const addUser = ( id, username, room ) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //TODO?: Add database lookup function
    //TODO?: Add digital signature check

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
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

//TODO?: Add active connections variable with a maximum of 4

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}