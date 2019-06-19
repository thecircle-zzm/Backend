const routes = require('express').Router()
const controller = require('../controllers/user.controller')

routes.get('/:username', controller.getStreamkeyByUsername)

module.exports = routes