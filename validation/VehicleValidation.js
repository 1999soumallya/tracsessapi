const { body, param, query } = require("express-validator");
const VehiclesModel = require("../models/VehiclesModel");
const VehicleTypeModel = require("../models/VehicleTypeModel");

exports.addVehicleValidation = [
    body("vehicles").isArray({ min: 1 }).withMessage('Provide vehicle array to creating vehicles').custom(async (value, { req }) => {
        return VehiclesModel.findOne
    }),
    body("vehicles.*").custom(async (value, { req }) => {
        return VehiclesModel.findOne({ [req.usertype]: req.userdetails._id, vehicleSource: (req.usertype == "user") ? 'OWN' : 'ORG', CC: value.CC, vehicleType: value.vehicleType, isDeleted: false }).then((result) => {
            if (result && (result.name.toLowerCase() == value.name.toLowerCase())) {
                return Promise.reject("This vehicle is already exist provide another vehicle")
            }
        })
    }),
    body("vehicles.*.CC").notEmpty().withMessage('Provide your CC').isNumeric().withMessage('This field only accept number value'),
    body("vehicles.*.vehicleTypeId").notEmpty().withMessage('This is a required field').isMongoId().withMessage("Provide vehicle type id").custom((value) => {
        return VehicleTypeModel.findOne({ _id: value, isDeleted: false }).then((details) => {
            if (!details) {
                return Promise.reject("This vehicle type is not exists")
            }
        })
    }),
    body("vehicles.*.name").notEmpty().withMessage('Provide your vehicle name'),
    body("vehicles.*.nickname").notEmpty().withMessage('Provide your vehicle nick name'),
    // body("vehicles.*.registrationNumber").notEmpty().withMessage('Provide your vehicle registration number'),
    // body("vehicles.*.racingNumber").notEmpty().withMessage('Provide your vehicle racing number'),
    body("vehicles.*.chassisNumber").notEmpty().withMessage('Provide your vehicle chassis number'),
    body("vehicles.*.engineNumber").notEmpty().withMessage('Provide your vehicle engine number')
]

exports.updateVehicleValidation = [
    param("id").notEmpty().withMessage('Provide vehicle id').isMongoId().withMessage("Provide vehicle type id").custom((value) => {
        return VehiclesModel.findOne({ _id: value, isDeleted: false }).then((result) => {
            if (!result) {
                return Promise.reject('Provide correct vehicle id')
            } else {
            }
        })
    }),
    body("CC").notEmpty().withMessage('Provide your CC').isNumeric().withMessage('This field only accept number value'),
    body("vehicleTypeId").notEmpty().withMessage('This is a required field').isMongoId().withMessage("Provide vehicle type id").custom((value) => {
        return VehicleTypeModel.findOne({ _id: value, isDeleted: false }).then((details) => {
            if (!details) {
                return Promise.reject("This vehicle type is not exists")
            }
        })
    }),
    body("name").notEmpty().withMessage('Provide your vehicle name').custom(async (value, { req }) => {
        return VehiclesModel.findOne({ _id: { $ne: req.params.id }, [req.usertype]: req.userdetails._id, vehicleSource: (req.usertype == "user") ? 'OWN' : 'ORG', CC: req.body.CC, vehicleType: req.body.vehicleType, isDeleted: false }).then((result) => {
            if (result && (result.name.toLowerCase() == value.toLowerCase())) {
                return Promise.reject("This vehicle is already exist provide another vehicle")
            }
        })
    }),
    body("nickname").notEmpty().withMessage('Provide your vehicle nick name'),
    // body("registrationNumber").notEmpty().withMessage('Provide your vehicle registration number'),
    // body("racingNumber").notEmpty().withMessage('Provide your vehicle racing number'),
    body("chassisNumber").notEmpty().withMessage('Provide your vehicle chassis number'),
    body("engineNumber").notEmpty().withMessage('Provide your vehicle engine number')
]

exports.deleteVehicleValidation = [
    query("id").notEmpty().withMessage('Provide vehicle id')
]

exports.toggleVehicleValidation = [
    param("id").notEmpty().withMessage('Provide vehicle id').isMongoId().withMessage("Provide vehicle type id")
]

exports.getRiderVehicleValidation = [
    body('riderId').notEmpty().withMessage('Provide valid rider id for get vehicle details').isMongoId().withMessage('Provide valid rider id for get vehicle details'),
    body('sessionId').notEmpty().withMessage('Provide valid session id for get vehicle details').isMongoId().withMessage('Provide valid session id for get vehicle details'),
]