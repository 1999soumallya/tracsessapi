const { body, param } = require("express-validator")
const TrackConditionModel = require("../models/TrackConditionModel")

exports.createTrackConditionValidation = [
    body('name').notEmpty().withMessage('Provide track condition name for create').custom(async (value) => {
        return await TrackConditionModel.findOne({ alias: value.replaceAll(/\s/g, '').toLowerCase() }).then((result) => {
            if (result) {
                throw new Error('Track condition already exists with this name')
            } else {
                return true
            }
        })
    })
]

exports.updateTrackConditionValidation = [
    param('id').notEmpty().withMessage('Provide track condition id for update').isMongoId().withMessage('Provide track condition id for update'),
    body('name').notEmpty().withMessage('Provide track condition name for update').custom(async (value, { req }) => {
        return await TrackConditionModel.findOne({ alias: value.replaceAll(/\s/g, '').toLowerCase(), _id: { $ne: req.params.id } }).then((result) => {
            if (result) {
                throw new Error('Track condition already exists with this name')
            } else {
                return true
            }
        })
    })
]

exports.commonTrackConditionValidation = [
    param('id').notEmpty().withMessage('Provide track condition id for performing operation').isMongoId().withMessage('Provide track condition id for performing operation')
]