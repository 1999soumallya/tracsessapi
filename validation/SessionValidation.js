const EventModel = require("../models/EventModel");
const PeriodModel = require("../models/PeriodModel");
const SessionModel = require("../models/SessionModel");
const { body, param } = require("express-validator");

exports.addsessionvalidation = [
    body("event").notEmpty().withMessage('Provide event id for create a session'),
    body("name").notEmpty().withMessage('Provide your session name'),
    body("fromTime").notEmpty().withMessage('Provide your session start time').isTime({ hourFormat: "hour24", mode: "default" }).withMessage('HH:mm format is only acceptable'),
    body("toTime").notEmpty().withMessage('Provide your session end time').isTime({ hourFormat: "hour24", mode: "default" }).withMessage('HH:mm format is only acceptable'),
    body("vehicleTypeId").notEmpty().withMessage('Provide session accepted vehicle type Id').isMongoId().withMessage('This field only accept vehicle type id').custom(async (value) => {
        return VehicleTypeModel.findOne({ _id: value, isDeleted: false }).then((result) => {
            if (!result) {
                return Promise.reject(result)
            }
        })
    }),
    // body("sameAsSession").optional().custom(async (value) => {
    //     await SessionModel.findById(value).then((result) => {
    //         if (result) {
    //             return true
    //         } else {
    //             throw new Error('Provide correct session id')
    //         }
    //     })
    // }),
    body("vehicleCategories").notEmpty().withMessage("provide vehicle category array").isArray().withMessage('This field must be an array'),
    body("vehicleCategories.*.vehicleSource").notEmpty().withMessage('Provide vehicle source for this vehicle category').isIn(['ORG', 'OWN']).withMessage('This field only accept ORG and OWN'),
    body("vehicleCategories.*.slots").notEmpty().withMessage('Provide total slot for this vehicle category'),
    body("vehicleCategories.*.amount").notEmpty().withMessage('Provide slot price for this vehicle category'),

    body("vehicleCategories.*.period").notEmpty().withMessage('Provide available period for this vehicle category').isObject({ strict: true }).withMessage("This field only accept object type").custom(async (value, { req }) => {
        if (!value.periodid || !value.dependentfields) {
            throw new Error("This period is not a proper object format add periodid and dependentfields key in this object")
        } else {
            await PeriodModel.findOne({ _id: value.periodid, isDeleted: false, isActive: true }).then((details) => {
                if (!details) {
                    throw new Error("This period is not available provide correct period")
                } else if (details.dependentfields.length > 0) {

                    for (let index = 0; index < details.dependentfields.length; index++) {
                        let field = details.dependentfields[index]
                        if (!Object.keys(value.dependentfields).includes(field)) {
                            throw new Error(`${field} field is required for this period`)
                        }
                    }

                } else {
                    return true
                }
            })
        }

    }),

    body("vehicleCategories.*.fromCC").if(body("vehicleCategories.*.CC").not().exists()).isNumeric().withMessage("Provide accepted vehicle start cc"),
    body("vehicleCategories.*.toCC").if(body("vehicleCategories.*.CC").not().exists()).isNumeric().withMessage("Provide accepted vehicle end cc"),
    body("vehicleCategories.*.CC").if(body("vehicleCategories.*.fromCC").not().exists() || body("vehicleCategories.*.toCC").not().exists()).isNumeric().withMessage("Provide accepted vehicle cc"),
]

exports.updatesessionvalidation = [
    param("id").notEmpty().withMessage('Provide session id').custom(async (value) => {
        await SessionModel.findOne({ _id: value, isDeleted: false }).then((result) => {
            if (result) {
                return true
            } else {
                throw new Error('Provide correct session id')
            }
        })
    }),
    body("name").notEmpty().withMessage('Provide your session name'),
    body("fromTime").notEmpty().withMessage('Provide your session start time').isTime({ hourFormat: "hour24", mode: "default" }).withMessage('HH:mm format is only acceptable'),
    body("toTime").notEmpty().withMessage('Provide your session end time').isTime({ hourFormat: "hour24", mode: "default" }).withMessage('HH:mm format is only acceptable'),
    body("vehicleTypeId").notEmpty().withMessage('Provide session accepted vehicle type Id').isMongoId().withMessage('This field only accept vehicle type id').custom(async (value) => {
        return VehicleTypeModel.findOne({ _id: value, isDeleted: false }).then((result) => {
            if (!result) {
                return Promise.reject(result)
            }
        })
    }),
    // body("sameAsSession").optional().custom(async (value) => {
    //     await SessionModel.findById(value).then((result) => {
    //         if (result) {
    //             return true
    //         } else {
    //             throw new Error('Provide correct session id')
    //         }
    //     })
    // })
]

exports.deletesessionvalidation = [
    param("id").notEmpty().withMessage('Provide session id').custom(async (value) => {
        await SessionModel.findOne({ _id: value, isDeleted: false }).then((result) => {
            if (result) {
                return true
            } else {
                throw new Error('Provide correct session id')
            }
        })
    }),
]

exports.deleteMultipleSessionValidation = [
    body("ids").notEmpty().withMessage('Provide valid session ids for delete session').isArray({ min: 0 }).withMessage('Provide at list one session id for delete session'),
    body("ids.*").notEmpty().withMessage('Provide valid session ids for delete session').isMongoId().withMessage('This field only accept valid session id').custom(async (value) => {
        await SessionModel.findOne({ _id: value, isDeleted: false }).then((result) => {
            if (result) {
                return true
            } else {
                throw new Error('Provide correct session id')
            }
        })
    }),
]

exports.singlesessionvalidation = [
    param("session_id").notEmpty().withMessage('Provide session id').custom(async (value) => {
        await SessionModel.findOne({ _id: value, isDeleted: false }).then((result) => {
            if (result) {
                return true
            } else {
                throw new Error('Provide correct session id')
            }
        })
    }),
]

exports.eventsessionvalidation = [
    param("eventid").notEmpty().withMessage('Provide session id').custom(async (value) => {
        await EventModel.findOne({ _id: value, isDeleted: false }).then((result) => {
            if (result) {
                return true
            } else {
                throw new Error('Provide correct session id')
            }
        })
    }),
]