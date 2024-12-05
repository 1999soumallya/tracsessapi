const { Logout } = require('../controllers/CommonController')
const { isAuthorized } = require('../middleware')

const Router = require('express').Router()

Router.get('/logout', isAuthorized, Logout)

module.exports = Router