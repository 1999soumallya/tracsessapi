const { body, param } = require("express-validator");
const TrackModel = require("../models/TrackModel");

exports.addTrackValidation = [
    body("name").notEmpty().withMessage("Provide track name for create").custom(async (value) => {
        return await TrackModel.findOne({ alias: value.replaceAll(/\s/g, '').toLowerCase(), isDeleted: false }).then((result) => {
            if (result) {
                throw new Error('Track already exists with this name')
            } else {
                return true
            }
        })
    }),
    body("location").notEmpty().withMessage("Provide track location for create"),
    body("isActive").notEmpty().withMessage("Provide track status for create").isBoolean().withMessage("Provide track status for create"),
]

exports.updateTrackValidation = [
    param("trackId").notEmpty().withMessage("Provide track id for update").isMongoId().withMessage('Provide valid track id for update').custom(async (value) => {
        return await TrackModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Track is not exists')
            } else {
                return true
            }
        })
    }),
    body("name").notEmpty().withMessage("Provide track name for create").custom(async (value, { req }) => {
        return await TrackModel.findOne({ alias: value.replaceAll(/\s/g, '').toLowerCase(), _id: { $ne: req.params.trackId } }).then((result) => {
            if (result) {
                throw new Error('Track already exists with this name')
            } else {
                return true
            }
        })
    }),
    body("location").notEmpty().withMessage("Provide track location for create")
]

exports.deleteTrackValidation = [
    param("trackId").notEmpty().withMessage("Provide track id for delete").isMongoId().withMessage('Provide valid track id for delete').custom(async (value) => {
        return await TrackModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Track is not exists')
            } else {
                return true
            }
        })
    })
]

exports.toggleTrackValidation = [
    param("trackId").notEmpty().withMessage("Provide track id for update").isMongoId().withMessage('Provide valid track id for update').custom(async (value) => {
        return await TrackModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Track is not exists')
            } else {
                return true
            }
        })
    })
]

exports.getTrackValidation = [
    param("trackId").notEmpty().withMessage("Provide track id for fetch details").isMongoId().withMessage('Provide valid track id for fetch details').custom(async (value) => {
        return await TrackModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Track is not exists')
            } else {
                return true
            }
        })
    })
]