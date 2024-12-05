const { body, param, query } = require("express-validator");
const TunersModel = require("../models/TunersModel");
const CrewMembersModel = require("../models/CrewMembersModel");
const TunersEventModel = require("../models/TunersEventModel");
const moment = require('moment-timezone')

exports.addMemberValidation = [
    body('tunerId').optional().isMongoId('Provide valid member id for add member').custom(async (value) => {
        return await TunersModel.findOne({ _id: value, isActive: true }).then((result) => {
            if (!result) {
                throw new Error('Member is not exists')
            } else {
                return true
            }
        })
    }),
    body('tunerId').optional().isMongoId('Provide valid member id for add member').custom(async (value, { req }) => {
        const { tunersDetails } = req;
        return await CrewMembersModel.findOne({ member: value, creator: tunersDetails._id, $or: [{ status: 'accepted' }, { status: 'pending' }, { expire: { $lte: moment().utc().format() } }] }).then((result) => {
            if (result) {
                throw new Error('Member is already in your group')
            } else {
                return true
            }
        })
    }),
    body('tunerId').optional().isMongoId('Provide valid member id for add member').custom(async (value, { req }) => {
        const { tunersDetails } = req;
        if (tunersDetails.id === value) {
            return Promise.reject(new Error('You cannot add yourself to your group'))
        } else {
            return Promise.resolve()
        }
    }),
    body('tuner').optional(),
    body('eventId').optional().isMongoId().withMessage('Provide valid event id for add member in event').custom(async (value, { req }) => {
        const { tunersDetails } = req;
        return await TunersEventModel.findOne({ _id: value, tuner: tunersDetails._id }).then((result) => {
            if (!result) {
                throw new Error('Event is not exists')
            } else {
                return true
            }
        })
    })
]

exports.acceptInvitationValidation = [
    body('invitationLink').notEmpty().withMessage('Provide valid invitation link for accept')
]

exports.getMemberValidation = [
    query('eventId').optional().isMongoId().withMessage('Provide valid event id for add member in event').custom(async (value, { req }) => {
        const { tunersDetails } = req;
        return await TunersEventModel.findOne({ _id: value, tuner: tunersDetails._id }).then((result) => {
            if (!result) {
                throw new Error('Event is not exists')
            } else {
                return true
            }
        })
    }),
    query('status').optional().isIn(['pending', 'accepted', 'declined']).withMessage('Provide valid status for get member it should be pending, accepted, declined')
]

exports.removeMemberValidation = [
    param('memberShipId').notEmpty().withMessage('Provide member ship id for remove member').isMongoId('Provide valid member ship id for remove member')
]

exports.getSingleMemberValidation = [
    param('memberShipId').notEmpty().withMessage('Provide member ship id for get member details').isMongoId('Provide valid member ship id for get member details')
]

exports.searchCrewValidation = [
    query('search').notEmpty().withMessage('Provide tuner details for search')
]