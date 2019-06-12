const routes = require('express').Router()
const controller = require('../controllers/stream.controller')

routes.post(controller.stream)

module.exports = routes