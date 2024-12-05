const { addMembers, removeMembers, getMembers, acceptInvitation, resendInvitation, declineInvitation, getSingleMember, searchMembers, searchMyMembers, getAllTeam } = require('../controllers/CrewMembersController')
const validate = require('../helpers/Validation')
const { isTuner } = require('../middleware')
const { addMemberValidation, removeMemberValidation, acceptInvitationValidation, getSingleMemberValidation, searchCrewValidation, getMemberValidation } = require('../validation/CrewMemberValidation')

const Router = require('express').Router()

Router.route('/add-member').post(isTuner, [addMemberValidation, validate], addMembers)
Router.route('/accept-invitation').put(isTuner, [acceptInvitationValidation, validate], acceptInvitation)
Router.route('/decline-invitation').put(isTuner, [acceptInvitationValidation, validate], declineInvitation)
Router.route('/resend-invitation/:memberShipId').patch(isTuner, [removeMemberValidation, validate], resendInvitation)
Router.route('/remove-member/:memberShipId').delete(isTuner, [removeMemberValidation, validate], removeMembers)
Router.route('/get-member').get(isTuner, [getMemberValidation, validate], getMembers)
Router.route('/get-single-member/:memberShipId').get(isTuner, [getSingleMemberValidation, validate], getSingleMember)

Router.route('/search-member').get(isTuner, [searchCrewValidation, validate], searchMembers)
Router.route('/search-my-member').get(isTuner, [searchCrewValidation, validate], searchMyMembers)

Router.route('/get-group').get(isTuner, getAllTeam)

module.exports = Router