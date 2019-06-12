const routes = require('express').Router()
const controller = require('../controllers/test.controller')

routes.get('/user', controller.createUser)

module.exports = routes