const { body, param } = require("express-validator")
const VehicleTypeModel = require("../models/VehicleTypeModel")

exports.addVehicleTypevalidation = [
    body("type").notEmpty().withMessage("Enter vehicle type for create").isString().withMessage('Enter vehicle type for create').custom((value) => {
        return VehicleTypeModel.findOne({ type: { $regex: value, $options: "si" }, isDeleted: false }).then((details) => {
            if (details) {
                return Promise.reject("This vechile type is already exsist")
            }
        })
    }),
    body("name").notEmpty().withMessage("Enter vehicle name for create").isString().withMessage('Enter vehicle name for create').custom((value) => {
        return VehicleTypeModel.findOne({ name: { $regex: value, $options: "si" }, isDeleted: false }).then((details) => {
            if (details) {
                return Promise.reject("This vechile name is already exsist")
            }
        })
    })
]

exports.deleteVehicleTypevalidation = [
    param("vehicle_id").notEmpty().withMessage("Enter vehicle type id for delete").isMongoId().withMessage('Enter vehicle type id for delete').custom((value) => {
        return VehicleTypeModel.findOne({ _id: value, isDeleted: false }).then((details) => {
            if (!details) {
                return Promise.reject("This vechile type is not exsist")
            }
        })
    })
]

exports.searchVehicleTypevalidation = [
    body("vehicle_id").notEmpty().withMessage("Enter vehicle type id for delete").isArray().withMessage("This field only array type"),
    body("vehicle_id.*").isMongoId().withMessage('Enter vehicle type id for delete').custom((value) => {
        return VehicleTypeModel.findOne({ _id: value, isDeleted: false }).then((details) => {
            if (!details) {
                return Promise.reject("This vechile type is not exsist")
            }
        })
    })
]