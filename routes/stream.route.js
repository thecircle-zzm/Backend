const routes = require('express').Router()
const controller = require('../controllers/stream.controller')

routes.get("/", controller.getAllStreams)
routes.get("/:session", controller.getViewerCount)

module.exports = routes