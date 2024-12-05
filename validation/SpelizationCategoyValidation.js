const { body, param } = require("express-validator");
const SpecializationCategoryModel = require("../models/SpecializationCategoryModel");

exports.addSpecializationValidation = [
    body("name").notEmpty().withMessage("Provide specialization category name for create").custom(async (value) => {
        return await SpecializationCategoryModel.findOne({ alias: value.replaceAll(/\s/g, ''), isDeleted: false }).then((result) => {
            if (result) {
                throw new Error('Specialization category already exists with this name')
            } else {
                return true
            }
        })
    }),
    body("isActive").notEmpty().withMessage("Provide specialization status for create"),
]

exports.updateSpecializationValidation = [
    param("id").notEmpty().withMessage("Provide specialization category name for update").isMongoId().withMessage('Provide valid category id').custom(async (value) => {
        return await SpecializationCategoryModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Specialization category is not exists')
            } else {
                return true
            }
        })
    }),
    body("name").notEmpty().withMessage("Provide specialization category name for update").custom(async (value, { req }) => {
        return await SpecializationCategoryModel.findOne({ alias: value.replaceAll(/\s/g, ''), _id: { $ne: req.params.id }, isDeleted: false }).then((result) => {
            if (result) {
                throw new Error('Specialization category already exists with this name')
            } else {
                return true
            }
        })
    }),
]

exports.commonSpecializationValidation = [
    param("id").notEmpty().withMessage("Provide specialization category name for delete").isMongoId().withMessage('Provide valid category id')
]