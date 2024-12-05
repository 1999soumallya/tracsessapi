const { body, param } = require("express-validator");
const RelationModel = require("../models/RelationModel");

exports.createRelationValidation = [
    body("name").notEmpty().withMessage("Provide relation name for create").custom(async (value) => {
        return await RelationModel.findOne({ alias: value.replaceAll(/\s/g, '-').toLowerCase(), isDeleted: false }).then((result) => {
            if (result) {
                throw new Error('Relation already exists with this name')
            } else {
                return true
            }
        })
    }),
    body("isActive").notEmpty().withMessage("Provide relation status for create").isBoolean().withMessage("Provide relation status for create")
]

exports.updateRelationValidation = [
    param("id").notEmpty().withMessage("Provide relation id for update").isMongoId().withMessage('Provide valid relation id for update').custom(async (value) => {
        return await RelationModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Relation is not exists')
            } else {
                return true
            }
        })
    }),
    body("name").notEmpty().withMessage("Provide relation name for create").custom(async (value, { req }) => {
        return await RelationModel.findOne({ alias: value.replaceAll(/\s/g, '-').toLowerCase(), isDeleted: false, _id: { $ne: req.params.id } }).then((result) => {
            if (result) {
                throw new Error('Relation already exists with this name')
            } else {
                return true
            }
        })
    }),
]

exports.deleteRelationValidation = [
    param("id").notEmpty().withMessage("Provide relation id for delete").isMongoId().withMessage('Provide valid relation id for delete').custom(async (value) => {
        return await RelationModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Relation is not exists')
            } else {
                return true
            }
        })
    })
]

exports.toggleRelationValidation = [
    param("id").notEmpty().withMessage("Provide relation id for update").isMongoId().withMessage('Provide valid relation id for update').custom(async (value) => {
        return await RelationModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Relation is not exists')
            } else {
                return true
            }
        })
    })
]

exports.getRelationValidation = [
    param("id").notEmpty().withMessage("Provide relation id for fetch details").isMongoId().withMessage('Provide valid relation id for fetch details').custom(async (value) => {
        return await RelationModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Relation is not exists')
            } else {
                return true
            }
        })
    })
]