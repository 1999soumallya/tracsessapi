const { getAllNotification, getSingleNotification, makeAsRead } = require('../controllers/NotificationController')
const validate = require('../helpers/Validation')
const { isAuthorized } = require('../middleware')
const { commonValidation } = require('../validation/NotificationValidation')

const Router = require('express').Router()

Router.route('/get-all').get(isAuthorized, getAllNotification)
Router.route('/get-single/:notificationId').get(isAuthorized, [commonValidation, validate], getSingleNotification)
Router.route('/make-as-read/:notificationId').put(isAuthorized, [commonValidation, validate], makeAsRead)

module.exports = Router