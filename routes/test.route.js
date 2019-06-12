const routes = require('express').Router()
const controller = require('../controllers/test.controller')

routes.post('/user', controller.createUser)

module.exports = routes