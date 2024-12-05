const { body, param } = require("express-validator");
const WeatherModel = require("../models/WeatherModel");

exports.createWeatherValidation = [
    body('name').notEmpty().withMessage('Provide weather name for create').custom(async (value) => {
        return await WeatherModel.findOne({ alias: value.replaceAll(/\s/g, '').toLowerCase() }).then((result) => {
            if (result) {
                throw new Error('Weather already exists with this name')
            } else {
                return true
            }
        })
    })
]

exports.updateWeatherValidation = [
    param('id').notEmpty().withMessage('Provide weather id for update').isMongoId().withMessage('Provide weather id for update'),
    body('name').notEmpty().withMessage('Provide weather name for update').custom(async (value, { req }) => {
        return await WeatherModel.findOne({ alias: value.replaceAll(/\s/g, '').toLowerCase(), _id: { $ne: req.params.id } }).then((result) => {
            if (result) {
                throw new Error('Weather already exists with this name')
            } else {
                return true
            }
        })
    })
]

exports.commonWeatherValidation = [
    param('id').notEmpty().withMessage('Provide weather id for performing operation').isMongoId().withMessage('Provide weather id for performing operation')
]