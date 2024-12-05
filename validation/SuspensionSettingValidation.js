const { body, param } = require("express-validator");
const SuspensionSettingModel = require("../models/SuspensionSettingModel");

exports.addSettingsValidation = [
    body('name').notEmpty().withMessage('Provide valid setting name').custom(async (value) => {
        return await SuspensionSettingModel.findOne({ alias: value.replaceAll(/\s/g, '').toLowerCase() }).then((result) => {
            if (result) {
                throw new Error('Setting already exists with this name')
            } else {
                return true
            }
        })
    })
]

exports.updateSettingsValidation = [
    param('id').notEmpty().withMessage('Provide valid setting id for update').isMongoId().withMessage('Provide valid settings id for update').custom(async (value) => {
        return await SuspensionSettingModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Setting is not exists')
            } else {
                return true
            }
        })
    }),
    body('name').notEmpty().withMessage('Provide valid setting name').custom(async (value, { req }) => {
        return await SuspensionSettingModel.findOne({ alias: value.replaceAll(/\s/g, '').toLowerCase(), _id: { $ne: req.params.id } }).then((result) => {
            if (result) {
                throw new Error('Setting already exists with this name')
            } else {
                return true
            }
        })
    })
]

exports.deleteSettingsValidation = [
    param('id').notEmpty().withMessage('Provide valid setting id for delete').isMongoId().withMessage('Provide valid settings id for delete').custom(async (value) => {
        return await SuspensionSettingModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Setting is not exists')
            } else {
                return true
            }
        })
    })
]

exports.toggleSettingsValidation = [
    param('id').notEmpty().withMessage('Provide valid setting id for update').isMongoId().withMessage('Provide valid settings id for update').custom(async (value) => {
        return await SuspensionSettingModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Setting is not exists')
            } else {
                return true
            }
        })
    })
]