const { body, param } = require("express-validator");

exports.createLapsValidation = [
    body('vehicleSetupId').notEmpty().withMessage('Provide vehicle setup id for creating laps').isMongoId().withMessage('Provide vehicle setup id for creating laps'),
    body('lapTimings').notEmpty().withMessage('Provide lap times for creating laps').isArray({ min: 1 }).withMessage('Provide laps for creating laps'),
    body('lapTimings.*').notEmpty().withMessage('Provide lap time for creating laps'),
]

exports.createMultipleLapsValidation = [
    body('multipleLaps').notEmpty().withMessage('Provide multipleLaps array for creating multiple records').isArray({ min: 1 }).withMessage('Provide at list one details for using this feature'),
    body('multipleLaps.*.vehicleSetupId').notEmpty().withMessage('Provide vehicle setup id for creating laps').isMongoId().withMessage('Provide vehicle setup id for creating laps'),
    body('multipleLaps.*.lapTimings').notEmpty().withMessage('Provide lap times for creating laps').isArray({ min: 1 }).withMessage('Provide laps for creating laps'),
    body('multipleLaps.*.lapTimings.*').notEmpty().withMessage('Provide lap time for creating laps'),
]

exports.getLapsValidation = [
    param('vehicleSetupId').notEmpty().withMessage('Provide vehicle setup id for getting laps').isMongoId().withMessage('Provide vehicle setup id for getting laps'),
]

exports.getLapsUserValidation = [
    param('sessionId').notEmpty().withMessage('Provide session id for getting laps').isMongoId().withMessage('Provide session id for getting laps'),
]