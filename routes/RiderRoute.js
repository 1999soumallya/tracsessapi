const { addRider, acceptInvitation, declineInvitation, resendInvitation, removeRider, getRiders, getSingleRider, searchRider, getSessionRiders } = require('../controllers/RiderController')
const validate = require('../helpers/Validation')
const { isTuner, isUser } = require('../middleware')
const { removeRiderValidation, acceptInvitationValidation, addRiderValidation, singleRiderValidation, searchRiderValidation, getRiderValidation, getRiderForSessionValidation } = require('../validation/RiderValidation')

const Router = require('express').Router()

Router.route('/add').post(isTuner, [addRiderValidation, validate], addRider)
Router.route('/accept-invitation').put(isUser, [acceptInvitationValidation, validate], acceptInvitation)
Router.route('/decline-invitation').put(isUser, [acceptInvitationValidation, validate], declineInvitation)
Router.route('/resend-invitation/:riderId').patch(isTuner, [removeRiderValidation, validate], resendInvitation)
Router.route('/remove-member/:riderId').delete(isTuner, [removeRiderValidation, validate], removeRider)
Router.route('/get-all/:eventId').get(isTuner, [getRiderValidation, validate], getRiders)
Router.route('/get-single/:riderId').get(isTuner, [singleRiderValidation, validate], getSingleRider)

Router.route('/').get(isTuner, [searchRiderValidation, validate], searchRider)
Router.route('/get-session-rider/:session_id').get(isTuner, [getRiderForSessionValidation, validate], getSessionRiders)

module.exports = Router