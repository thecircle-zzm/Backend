const routes = require('express').Router()
const test_routes = require('./test.route')
const streaming_routes = require('./stream.route')
const user_routes = require('./user.route')

routes.get('/', (req, res) => res.status(200).json({"messsage": "Hello World!"}))
routes.use('/stream', streaming_routes)
routes.use('/user', user_routes)
routes.use('/test', test_routes)

routes.use('*', (req, res) => res.status(404).json({"message": "Not found"}).end())

module.exports = routes