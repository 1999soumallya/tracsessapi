const Router = require('express').Router()
const validate = require('../helpers/Validation')
const { addsession, updatesession, deletesession, togglesession, getSingleSession, getEventAllSession, deleteMultipleSession } = require('../controllers/SessionController')
const { addsessionvalidation, updatesessionvalidation, deletesessionvalidation, eventsessionvalidation, singlesessionvalidation, deleteMultipleSessionValidation } = require('../validation/SessionValidation')
const { isAuthorized } = require('../middleware')

Router.route('/add-session').post(isAuthorized, [addsessionvalidation, validate], addsession)
Router.route('/update-session/:id').put(isAuthorized, updatesession)
Router.route('/delete-session/:id').delete(isAuthorized, [deletesessionvalidation, validate], deletesession)
Router.route('/delete-multiple-session').post(isAuthorized, [deleteMultipleSessionValidation, validate], deleteMultipleSession)
Router.route('/toggle-session/:id').patch(isAuthorized, [deletesessionvalidation, validate], togglesession)

Router.route('/get-all-session/:eventid').get(isAuthorized, [eventsessionvalidation, validate], getEventAllSession)
Router.route('/get-single-session/:session_id').get(isAuthorized, [singlesessionvalidation, validate], getSingleSession)

module.exports = Router