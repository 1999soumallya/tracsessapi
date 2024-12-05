const { body, param, oneOf } = require("express-validator");
const VehicleCategoryModel = require("../models/VehicleCategoryModel");
const PeriodModel = require("../models/PeriodModel");

exports.addvehiclecategoryvalidation = [
    body("vehicleSource").notEmpty().withMessage('Provide vehicle source for this vehicle category').isIn(['ORG', 'OWN']).withMessage('This field only accept ORG and OWN'),
    oneOf([
        [
            body("fromCC").isNumeric().withMessage("Provide accepted vehicle start cc"),
            body("toCC").isNumeric().withMessage("Provide accepted vehicle end cc"),
        ],
        body("CC").isNumeric().withMessage("Provide accepted vehicle cc"),
    ], { errorType: "flat", message: "Provide vehicle category start cc ,end cc or cc" }),
    body("slots").notEmpty().withMessage('Provide total slot for this vehicle category'),
    body("bookedSlots").notEmpty().withMessage('Provide booked slot for this vehicle category'),
    body("amount").notEmpty().withMessage('Provide slot price for this vehicle category'),

    body("period").notEmpty().withMessage('Provide available period for this vehicle category').isObject({ strict: true }).withMessage("This field only accept object type").custom(async (value, { req }) => {
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
]

exports.updatevehiclecategoryvalidation = [
    param("id").notEmpty().withMessage('Provide vehicle category id').custom(async (value) => {
        await VehicleCategoryModel.findOne({ _id: value, isDeleted: false }).then((result) => {
            if (result) {
                return true
            } else {
                throw new Error('Provide correct vehicle category id')
            }
        })
    }),
    body("vehicleSource").notEmpty().withMessage('Provide vehicle source for this vehicle category').isIn(['ORG', 'OWN']).withMessage('This field only accept ORG and OWN'),
    oneOf([
        [
            body("fromCC").isNumeric().withMessage("Provide accepted vehicle start cc"),
            body("toCC").isNumeric().withMessage("Provide accepted vehicle end cc"),
        ],
        body("CC").isNumeric().withMessage("Provide accepted vehicle cc"),
    ], { errorType: "flat", message: "Provide vehicle category start cc ,end cc or cc" }),
    body("slots").notEmpty().withMessage('Provide total slot for this vehicle category'),
    body("bookedSlots").notEmpty().withMessage('Provide booked slot for this vehicle category'),
    body("amount").notEmpty().withMessage('Provide slot price for this vehicle category'),
    body("period").notEmpty().withMessage('Provide available period for this vehicle category'),
    body("duration").notEmpty().withMessage('Provide duration for this vehicle category'),
    body("duration.hours").notEmpty().withMessage('Provide duration hour for this vehicle category'),
    body("duration.minutes").notEmpty().withMessage('Provide duration minute for this vehicle category'),
    body("maxAllowedDuration").notEmpty().withMessage('Provide max allow duration for this vehicle category'),
    body("maxAllowedDuration.hours").notEmpty().withMessage('Provide max allow duration hour for this vehicle category'),
    body("maxAllowedDuration.minutes").notEmpty().withMessage('Provide max allow duration minute for this vehicle category')
]

exports.deletevehiclecategoryvalidation = [
    param("id").notEmpty().withMessage('Provide vehicle category id').custom(async (value) => {
        await VehicleCategoryModel.findOne({ _id: value, isDeleted: false }).then((result) => {
            if (result) {
                return true
            } else {
                throw new Error('Provide correct vehicle category id')
            }
        })
    })
]