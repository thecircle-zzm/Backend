const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const {createMessage} = require('./messages.util')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users.util')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = 5000

server.listen(port, () => {
    console.log(`Socket IO: ${port}`)
})

io.on('connection', (socket) => {
    console.log('New WebSocket connection created.')
    
    socket.on('join', (json) => {
        //TODO?: Add database lookup function
        //TODO: Add digital signature check

        let body = JSON.parse(json)
        let username = body.username
        let room = body.room
        addUser(socket.id, username, room)
        socket.join(room)

        socket.emit('sendMessage', createMessage(JSON.stringify({username: 'Channel', message: 'Welcome: ' + username})))

        socket.broadcast.to(room).emit('sendMessage', createMessage(JSON.stringify({username: 'Channel', message: username +' has joined!'})))
        io.to(room).emit('roomData', {
            room: room,
            users: getUsersInRoom(room)
        })
    })



    socket.on('sendMessage', (json) => {
        //TODO?: Add specific room in JSON Object
        // send message to the right room

        const user = getUser(socket.id)
        io.to(user.room).emit('sendMessage', createMessage(json ))
    }) 

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('sendMessage', createMessage(JSON.stringify({username: 'Channel', message: 'Bye ' + user.username})))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

})
