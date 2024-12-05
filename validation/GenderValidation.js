const { body, param } = require("express-validator");
const GenderModel = require("../models/GenderModel");

exports.createGenderValidation = [
    body("name").notEmpty().withMessage("Provide relation name for create").custom(async (value) => {
        return await GenderModel.findOne({ alias: value.replaceAll(/\s/g, '-').toLowerCase(), isDeleted: false }).then((result) => {
            if (result) {
                throw new Error('Gender already exists with this name')
            } else {
                return true
            }
        })
    }),
    body("isActive").notEmpty().withMessage("Provide relation status for create").isBoolean().withMessage("Provide relation status for create")
]

exports.updateGenderValidation = [
    param("id").notEmpty().withMessage("Provide relation id for update").isMongoId().withMessage('Provide valid relation id for update').custom(async (value) => {
        return await GenderModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Gender is not exists')
            } else {
                return true
            }
        })
    }),
    body("name").notEmpty().withMessage("Provide relation name for create").custom(async (value, { req }) => {
        return await GenderModel.findOne({ alias: value.replaceAll(/\s/g, '-').toLowerCase(), isDeleted: false, _id: { $ne: req.params.id } }).then((result) => {
            if (result) {
                throw new Error('Gender already exists with this name')
            } else {
                return true
            }
        })
    }),
]

exports.deleteGenderValidation = [
    param("id").notEmpty().withMessage("Provide relation id for delete").isMongoId().withMessage('Provide valid relation id for delete').custom(async (value) => {
        return await GenderModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Gender is not exists')
            } else {
                return true
            }
        })
    })
]

exports.toggleGenderValidation = [
    param("id").notEmpty().withMessage("Provide relation id for update").isMongoId().withMessage('Provide valid relation id for update').custom(async (value) => {
        return await GenderModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Gender is not exists')
            } else {
                return true
            }
        })
    })
]

exports.getGenderValidation = [
    param("id").notEmpty().withMessage("Provide relation id for fetch details").isMongoId().withMessage('Provide valid relation id for fetch details').custom(async (value) => {
        return await GenderModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Gender is not exists')
            } else {
                return true
            }
        })
    })
]