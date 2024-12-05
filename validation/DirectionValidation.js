const { body, param } = require("express-validator")
const DirectionModel = require("../models/DirectionModel.js")

exports.createDirectionValidation = [
    body('name').notEmpty().withMessage('Provide direction name for create').custom(async (value) => {
        return await DirectionModel.findOne({ alias: value.replaceAll(/\s/g, '').toLowerCase() }).then((result) => {
            if (result) {
                throw new Error('Direction already exists with this name')
            } else {
                return true
            }
        })
    })
]

exports.updateDirectionValidation = [
    param('id').notEmpty().withMessage('Provide direction id for update').isMongoId().withMessage('Provide direction id for update'),
    body('name').notEmpty().withMessage('Provide direction name for update').custom(async (value, { req }) => {
        return await DirectionModel.findOne({ alias: value.replaceAll(/\s/g, '').toLowerCase(), _id: { $ne: req.params.id } }).then((result) => {
            if (result) {
                throw new Error('Direction already exists with this name')
            } else {
                return true
            }
        })
    })
]

exports.commonDirectionValidation = [
    param('id').notEmpty().withMessage('Provide direction id for performing operation').isMongoId().withMessage('Provide direction id for performing operation')
]