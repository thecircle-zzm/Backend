const routes = require('express').Router()
const example_routes = require('./example.route')
const test_routes = require('./test.route')

routes.get('/', (req, res) => res.status(200).json({"messsage": "Hello World!"}))
routes.use('/example', example_routes)
routes.use('/test', test_routes)
routes.use('*', (req, res) => res.status(404).json({"message": "Not found"}).end())

module.exports = routes