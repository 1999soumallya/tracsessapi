const { body, param } = require("express-validator");
const DesignationModel = require("../models/DesignationModel");

exports.addDesignationValidation = [
    body("name").notEmpty().withMessage("Provide Designation name for create").custom(async (value) => {
        return await DesignationModel.findOne({ alias: value.replaceAll(/\s/g, ''), isDeleted: false }).then((result) => {
            if (result) {
                throw new Error('Designation already exists with this name')
            } else {
                return true
            }
        })
    }),
    body("isActive").notEmpty().withMessage("Provide Designation status for create"),
]

exports.updateDesignationValidation = [
    param("id").notEmpty().withMessage("Provide Designation  name for update").isMongoId().withMessage('Provide valid  id').custom(async (value) => {
        return await DesignationModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Designation is not exists')
            } else {
                return true
            }
        })
    }),
    body("name").notEmpty().withMessage("Provide Designation  name for update").custom(async (value, { req }) => {
        return await DesignationModel.findOne({ alias: value.replaceAll(/\s/g, ''), _id: { $ne: req.params.id }, isDeleted: false }).then((result) => {
            if (result) {
                throw new Error('Designation already exists with this name')
            } else {
                return true
            }
        })
    }),
]

exports.commonDesignationValidation = [
    param("id").notEmpty().withMessage("Provide Designation name for delete").isMongoId().withMessage('Provide valid  id')
]