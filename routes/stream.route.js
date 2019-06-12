const routes = require('express').Router()
const controller = require('../controllers/stream.controller')

routes.get('/', controller.get)

module.exports = routes