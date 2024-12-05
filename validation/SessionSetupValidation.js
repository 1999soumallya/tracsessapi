const { body, param } = require("express-validator");
const SessionModel = require("../models/SessionModel");
const TrackConditionModel = require("../models/TrackConditionModel");
const WeatherModel = require("../models/WeatherModel");
const CrewMembersModel = require("../models/CrewMembersModel");
const TunersModel = require("../models/TunersModel");
const RidersModel = require("../models/RidersModel");
const UserModel = require("../models/UserModel");
const SessionSetupModel = require("../models/SessionSetupModel");
const DirectionModel = require("../models/DirectionModel.js");

exports.createSessionSetupValidation = [
    body('sessionId').notEmpty().withMessage('Provide session id for create setup').isMongoId().withMessage('Provide session id for create setup').custom(async (value) => {
        return await SessionModel.findOne({ _id: value, isCanceled: false, isActive: true }).then((result) => {
            if (!result) {
                throw new Error('Session is not exists provide valid session id for create setup')
            } else {
                return true
            }
        })
    }),
    body('name').notEmpty().withMessage('Provide setup name for create setup'),
    // body('trackConditionId').optional().withMessage('Provide track condition for create setup').isMongoId().withMessage('Provide track condition id for create setup').custom(async (value) => {
    //     return await TrackConditionModel.findOne({ _id: value, isActive: true }).then((result) => {
    //         if (!result) {
    //             throw new Error('Track condition is not exists provide valid id for create setup')
    //         } else {
    //             return true
    //         }
    //     })
    // }),
    // body('weatherId').optional().withMessage('Provide weather for create setup').isMongoId().withMessage('Provide weather id for create setup').custom(async (value) => {
    //     return await WeatherModel.findOne({ _id: value, isActive: true }).then((result) => {
    //         if (!result) {
    //             throw new Error('Weather is not exists provide valid id for create setup')
    //         } else {
    //             return true
    //         }
    //     })
    // }),
    // body('temperature').optional().withMessage('Provide temperature for create setup').isObject({ strict: true }).withMessage('Provide temperature for create setup'),
    // body('temperature.track').optional().withMessage('Provide track temperature for create setup').isString().withMessage('Provide track temperature for create setup'),
    // body('temperature.ambient').optional().withMessage('Provide ambient temperature for create setup').isString().withMessage('Provide ambient temperature for create setup'),

    // body('wind').optional().withMessage('Provide wind for create setup').isObject({ strict: true }).withMessage('Provide wind for create setup'),
    // body('wind.speed').optional().withMessage('Provide speed wind for create setup').isString().withMessage('Provide speed wind for create setup'),
    // body('wind.directionId').optional().withMessage('Provide direction wind for create setup').isMongoId().withMessage('Provide direction wind id for create setup').custom(async (value) => {
    //     return await DirectionModel.findOne({ _id: value, isActive: true }).then((result) => {
    //         if (!result) {
    //             throw new Error('Direction is not exists provide valid id for create setup')
    //         } else {
    //             return true
    //         }
    //     })
    // }),

    // body('riderGroup').optional().isArray().withMessage('Provide riders array for create setup'),
    // body('riderGroup.*.riderId').notEmpty().withMessage('Provide rider gender for create setup').isString().withMessage('Provide rider gender for create setup').custom(async (value, { req }) => {
    //     return await RidersModel.findOne({ creator: req.tunersDetails._id, rider: value, isJoined: true }).then(async (result) => {
    //         if (!result) {
    //             throw new Error('Rider is not exists in your group provide valid id for create setup')
    //         } else {
    //             return await UserModel.findOne({ _id: value, isVerified: true }).then((details) => {
    //                 if (!details) {
    //                     throw new Error('User is not exists provide valid id for create setup')
    //                 } else {
    //                     return true
    //                 }
    //             })
    //         }
    //     })
    // }),
    // body('riderGroup.*.vehicleDetails').notEmpty().withMessage('Provide vehicle details for create setup').isArray().withMessage('Provide vehicle details for create setup'),

    // body('riderGroup.*.vehicleDetails.*.vehicleId').notEmpty().withMessage('Provide vehicle id for create setup').isString().withMessage('Provide vehicle id for create setup'),

    // body('riderGroup.*.vehicleDetails.*.crewMembersId').notEmpty().withMessage('Provide tuner id for create setup').isArray().withMessage('Provide tuner id for create setup'),

    // body('riderGroup.*.vehicleDetails.*.crewMembersId.*').notEmpty().withMessage('Provide rider age for create setup').isMongoId().withMessage('Provide rider age for create setup').custom(async (value, { req }) => {
    //     return await CrewMembersModel.findOne({ creator: req.tunersDetails._id, member: value, isJoined: true }).then(async (result) => {
    //         if (!result) {
    //             throw new Error('Crew member is not exists in your group provide valid id for create setup')
    //         } else {
    //             return await TunersModel.findOne({ _id: value, isActive: true }).then((details) => {
    //                 if (!details) {
    //                     throw new Error('Tuner is not exists provide valid id for create setup')
    //                 } else {
    //                     return true
    //                 }
    //             })
    //         }
    //     })
    // }),
]


exports.updateSessionSetupValidation = [
    param("session_setup_id").notEmpty().withMessage("Provide setup id for update").isMongoId().withMessage('Provide valid setup id for update').custom(async (value) => {
        return await SessionSetupModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                throw new Error('Session is not exists provide valid session id for update setup')
            } else {
                return true
            }
        })
    }),
    // body('name').notEmpty().withMessage('Provide setup name for create setup'),
    // body('trackConditionId').notEmpty().withMessage('Provide track condition for create setup').isMongoId().withMessage('Provide track condition id for create setup').custom(async (value) => {
    //     return await TrackConditionModel.findOne({ _id: value, isActive: true }).then((result) => {
    //         if (!result) {
    //             throw new Error('Track condition is not exists provide valid id for create setup')
    //         } else {
    //             return true
    //         }
    //     })
    // }),
    // body('weatherId').notEmpty().withMessage('Provide weather for create setup').isMongoId().withMessage('Provide weather id for create setup').custom(async (value) => {
    //     return await WeatherModel.findOne({ _id: value, isActive: true }).then((result) => {
    //         if (!result) {
    //             throw new Error('Weather is not exists provide valid id for create setup')
    //         } else {
    //             return true
    //         }
    //     })
    // }),
    // body('temperature').notEmpty().withMessage('Provide temperature for create setup').isObject({ strict: true }).withMessage('Provide temperature for create setup'),
    // body('temperature.track').notEmpty().withMessage('Provide track temperature for create setup').isString().withMessage('Provide track temperature for create setup'),
    // body('temperature.ambient').notEmpty().withMessage('Provide ambient temperature for create setup').isString().withMessage('Provide ambient temperature for create setup'),

    // body('wind').notEmpty().withMessage('Provide wind for create setup').isObject({ strict: true }).withMessage('Provide wind for create setup'),
    // body('wind.speed').notEmpty().withMessage('Provide speed wind for create setup').isString().withMessage('Provide speed wind for create setup'),
    // body('wind.directionId').notEmpty().withMessage('Provide direction wind for create setup').isMongoId().withMessage('Provide direction wind id for create setup').custom(async (value) => {
    //     return await DirectionModel.findOne({ _id: value, isActive: true }).then((result) => {
    //         if (!result) {
    //             throw new Error('Direction is not exists provide valid id for create setup')
    //         } else {
    //             return true
    //         }
    //     })
    // }),
]

exports.commonSessionSetupValidation = [
    param("session_setup_id").notEmpty().withMessage("Provide id for do any operation").isMongoId().withMessage('Provide valid setup id for any operation')
]

exports.cloneSetupForSessionValidation = [
    body("old_session_id").notEmpty().withMessage("Provide old session id for clone setup").isMongoId().withMessage('Provide valid old session id for clone setup'),
    body("new_session_id").notEmpty().withMessage("Provide session id for clone setup").isString().withMessage('Provide valid session id for clone setup')
]

exports.getSessionSetupValidation = [
    param("session_id").notEmpty().withMessage("Provide id for do any operation").isMongoId().withMessage('Provide valid setup id for any operation')
]

exports.getSingleSessionSetupValidation = [
    param("session_setup_id").notEmpty().withMessage("Provide id for do any operation").isMongoId().withMessage('Provide valid setup id for any operation')
]

exports.addRiderValidation = [
    param("session_setup_id").notEmpty().withMessage("Provide setup id for add rider").isMongoId().withMessage('Provide valid setup id for add rider'),
    // body('riderGroup').notEmpty().withMessage('Provide riders array for create setup').isArray().withMessage('Provide riders array for create setup'),
    // body('riderGroup.*.riderId').notEmpty().withMessage('Provide rider gender for create setup').isString().withMessage('Provide rider gender for create setup').custom(async (value, { req }) => {
    //     return await RidersModel.findOne({ creator: req.tunersDetails._id, rider: value, isJoined: true }).then(async (result) => {
    //         if (!result) {
    //             throw new Error('Rider is not exists in your group provide valid id for create setup')
    //         } else {
    //             return await UserModel.findOne({ _id: value, isVerified: true }).then((details) => {
    //                 if (!details) {
    //                     throw new Error('User is not exists provide valid id for create setup')
    //                 } else {
    //                     return true
    //                 }
    //             })
    //         }
    //     })
    // }),
    // body('riderGroup.*.vehicleDetails').notEmpty().withMessage('Provide vehicle details for create setup').isArray().withMessage('Provide vehicle details for create setup'),

    // body('riderGroup.*.vehicleDetails.*.vehicleId').notEmpty().withMessage('Provide vehicle id for create setup').isString().withMessage('Provide vehicle id for create setup'),

    // body('riderGroup.*.vehicleDetails.*.crewMembersId').notEmpty().withMessage('Provide tuner id for create setup').isArray().withMessage('Provide tuner id for create setup'),

    // body('riderGroup.*.vehicleDetails.*.crewMembersId.*').notEmpty().withMessage('Provide rider age for create setup').isMongoId().withMessage('Provide rider age for create setup').custom(async (value, { req }) => {
    //     return await CrewMembersModel.findOne({ creator: req.tunersDetails._id, member: value, isJoined: true }).then(async (result) => {
    //         if (!result) {
    //             throw new Error('Crew member is not exists in your group provide valid id for create setup')
    //         } else {
    //             return await TunersModel.findOne({ _id: value, isActive: true }).then((details) => {
    //                 if (!details) {
    //                     throw new Error('Tuner is not exists provide valid id for create setup')
    //                 } else {
    //                     return true
    //                 }
    //             })
    //         }
    //     })
    // }),
]

exports.removeRiderValidation = [
    param('rider_group_id').notEmpty().withMessage('Provide rider group id for remove a rider').isMongoId().withMessage('Provide rider group id for remove a rider'),
]

exports.addVehicleValidation = [
    param("session_setup_id").notEmpty().withMessage("Provide setup id for add rider").isMongoId().withMessage('Provide valid setup id for add rider'),
    body('riderVehicleDetails').notEmpty().withMessage('Provide vehicle and rider group id for add vehicle').isArray({ min: 1 }).withMessage('Provide vehicle and rider group id for add vehicle'),
    body('riderVehicleDetails.*.riderGroupId').notEmpty().withMessage('Provide rider group id for add a vehicle').isMongoId().withMessage('Provide rider group id for add a vehicle'),
    body('riderVehicleDetails.*.vehicleDetails').notEmpty().withMessage('Provide vehicle details for create setup').isArray().withMessage('Provide vehicle details for create setup'),

    // body('riderGroupId').notEmpty().withMessage('Provide rider group id for add a vehicle').isMongoId().withMessage('Provide rider group id for add a vehicle'),
    // body('vehicleDetails').notEmpty().withMessage('Provide vehicle details for create setup').isArray().withMessage('Provide vehicle details for create setup'),

    // body('vehicleDetails.*.vehicleId').notEmpty().withMessage('Provide vehicle id for create setup').isString().withMessage('Provide vehicle id for create setup'),

    // body('vehicleDetails.*.crewMembersId').notEmpty().withMessage('Provide tuner id for create setup').isArray().withMessage('Provide tuner id for create setup'),

    // body('vehicleDetails.*.crewMembersId.*').notEmpty().withMessage('Provide rider age for create setup').isMongoId().withMessage('Provide rider age for create setup').custom(async (value, { req }) => {
    //     return await CrewMembersModel.findOne({ creator: req.tunersDetails._id, member: value, isJoined: true }).then(async (result) => {
    //         if (!result) {
    //             throw new Error('Crew member is not exists in your group provide valid id for create setup')
    //         } else {
    //             return await TunersModel.findOne({ _id: value, isActive: true }).then((details) => {
    //                 if (!details) {
    //                     throw new Error('Tuner is not exists provide valid id for create setup')
    //                 } else {
    //                     return true
    //                 }
    //             })
    //         }
    //     })
    // }),
]

exports.removeVehicleValidation = [
    param("session_setup_id").notEmpty().withMessage("Provide setup id for add rider").isMongoId().withMessage('Provide valid setup id for add rider'),
    body('riderVehicleDetails').notEmpty().withMessage('Provide vehicle and rider group id for add vehicle').isArray({ min: 1 }).withMessage('Provide vehicle and rider group id for add vehicle'),
    body('riderVehicleDetails.*.riderGroupId').notEmpty().withMessage('Provide rider group id for add a vehicle').isMongoId().withMessage('Provide rider group id for add a vehicle'),
    body('riderVehicleDetails.*.vehicleGroupId').notEmpty().withMessage('Provide vehicle group id for remove vehicle').isMongoId().withMessage('Provide vehicle group id for remove vehicle'),
]