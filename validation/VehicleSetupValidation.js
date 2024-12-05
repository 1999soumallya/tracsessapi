const { body, param } = require("express-validator");

exports.createVehicleSetupValidation = [
    param('vehicleGroupId').notEmpty().withMessage('Provide vehicle group id for create vehicle setup').isMongoId().withMessage('Provide valid vehicle group id for create vehicle setup'),

    body('name').notEmpty().withMessage('Provide setup name for create vehicle setup'),
    
    // body('tyre').notEmpty().withMessage('Provide tyre settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('tyre.front').notEmpty().withMessage('Provide front tyre settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('tyre.front.pressure').notEmpty().withMessage('Provide front tyre pressure settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('tyre.front.pressure.cold').notEmpty().withMessage('Provide front tyre pressure in clod for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('tyre.front.pressure.hot').notEmpty().withMessage('Provide front tyre pressure in clod for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('tyre.front.temperature').notEmpty().withMessage('Provide front tyre temperature for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('tyre.rear').notEmpty().withMessage('Provide front tyre settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('tyre.rear.pressure').notEmpty().withMessage('Provide front tyre pressure settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('tyre.rear.pressure.cold').notEmpty().withMessage('Provide front tyre pressure in clod for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('tyre.rear.pressure.hot').notEmpty().withMessage('Provide front tyre pressure in clod for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('tyre.rear.temperature').notEmpty().withMessage('Provide front tyre temperature for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),


    // body('suspension').notEmpty().withMessage('Provide suspension settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.sag').notEmpty().withMessage('Provide suspension sag settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.sag.front').notEmpty().withMessage('Provide suspension sag font settings for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.sag.rear').notEmpty().withMessage('Provide suspension sag rear settings for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.dropHeight').notEmpty().withMessage('Provide suspension drop hight settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.dropHeight.front').notEmpty().withMessage('Provide suspension drop hight font settings for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.dropHeight.rear').notEmpty().withMessage('Provide suspension drop hight rear settings for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),

    // body('suspension.preload').notEmpty().withMessage('Provide suspension preload settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.preload.front').notEmpty().withMessage('Provide suspension preload font settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.preload.front.value').notEmpty().withMessage('Provide suspension preload font value for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.preload.front.settings').notEmpty().withMessage('Provide suspension preload font settings for create vehicle setup').isString().withMessage('This field is only accept string value'),
    // body('suspension.preload.rear').notEmpty().withMessage('Provide suspension preload rear settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.preload.rear.value').notEmpty().withMessage('Provide suspension preload rear value for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.preload.rear.settings').notEmpty().withMessage('Provide suspension preload rear settings for create vehicle setup').isString().withMessage('This field is only accept string value'),

    // body('suspension.compression').notEmpty().withMessage('Provide suspension compression settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.compression.front').notEmpty().withMessage('Provide suspension compression font settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.compression.front.value').notEmpty().withMessage('Provide suspension compression font value for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.compression.front.settings').notEmpty().withMessage('Provide suspension compression font settings for create vehicle setup').isString().withMessage('This field is only accept string value'),
    // body('suspension.compression.rear').notEmpty().withMessage('Provide suspension compression font settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.compression.rear.value').notEmpty().withMessage('Provide suspension compression font value for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.compression.rear.settings').notEmpty().withMessage('Provide suspension compression font settings for create vehicle setup').isString().withMessage('This field is only accept string value'),

    // body('suspension.rebound').notEmpty().withMessage('Provide suspension rebound settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.rebound.front').notEmpty().withMessage('Provide suspension rebound font settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.rebound.front.value').notEmpty().withMessage('Provide suspension rebound font value for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.rebound.front.settings').notEmpty().withMessage('Provide suspension rebound font settings for create vehicle setup').isString().withMessage('This field is only accept string value'),
    // body('suspension.rebound.rear').notEmpty().withMessage('Provide suspension rebound font settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.rebound.rear.value').notEmpty().withMessage('Provide suspension rebound font value for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.rebound.rear.settings').notEmpty().withMessage('Provide suspension rebound font settings for create vehicle setup').isString().withMessage('This field is only accept string value'),

    // body('sprockets').notEmpty().withMessage('Provide sprockets settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('sprockets.front').notEmpty().withMessage('Provide sprockets front settings for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('sprockets.rear').notEmpty().withMessage('Provide sprockets front settings for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
]


exports.updateVehicleSetupValidation = [
    param('setupId').notEmpty().withMessage('Provide setup id for update vehicle setup').isMongoId().withMessage('Provide valid setup id for update vehicle setup'),

    // body('name').notEmpty().withMessage('Provide setup name for create vehicle setup'),

    // body('tyre').notEmpty().withMessage('Provide tyre settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('tyre.front').notEmpty().withMessage('Provide front tyre settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('tyre.front.pressure').notEmpty().withMessage('Provide front tyre pressure settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('tyre.front.pressure.cold').notEmpty().withMessage('Provide front tyre pressure in clod for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('tyre.front.pressure.hot').notEmpty().withMessage('Provide front tyre pressure in clod for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('tyre.front.temperature').notEmpty().withMessage('Provide front tyre temperature for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('tyre.rear').notEmpty().withMessage('Provide front tyre settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('tyre.rear.pressure').notEmpty().withMessage('Provide front tyre pressure settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('tyre.rear.pressure.cold').notEmpty().withMessage('Provide front tyre pressure in clod for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('tyre.rear.pressure.hot').notEmpty().withMessage('Provide front tyre pressure in clod for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('tyre.rear.temperature').notEmpty().withMessage('Provide front tyre temperature for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),


    // body('suspension').notEmpty().withMessage('Provide suspension settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.sag').notEmpty().withMessage('Provide suspension sag settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.sag.front').notEmpty().withMessage('Provide suspension sag font settings for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.sag.rear').notEmpty().withMessage('Provide suspension sag rear settings for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.dropHeight').notEmpty().withMessage('Provide suspension drop hight settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.dropHeight.front').notEmpty().withMessage('Provide suspension drop hight font settings for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.dropHeight.rear').notEmpty().withMessage('Provide suspension drop hight rear settings for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),

    // body('suspension.preload').notEmpty().withMessage('Provide suspension preload settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.preload.front').notEmpty().withMessage('Provide suspension preload font settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.preload.front.value').notEmpty().withMessage('Provide suspension preload font value for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.preload.front.settings').notEmpty().withMessage('Provide suspension preload font settings for create vehicle setup').isString().withMessage('This field is only accept string value'),
    // body('suspension.preload.rear').notEmpty().withMessage('Provide suspension preload rear settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.preload.rear.value').notEmpty().withMessage('Provide suspension preload rear value for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.preload.rear.settings').notEmpty().withMessage('Provide suspension preload rear settings for create vehicle setup').isString().withMessage('This field is only accept string value'),

    // body('suspension.compression').notEmpty().withMessage('Provide suspension compression settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.compression.front').notEmpty().withMessage('Provide suspension compression font settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.compression.front.value').notEmpty().withMessage('Provide suspension compression font value for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.compression.front.settings').notEmpty().withMessage('Provide suspension compression font settings for create vehicle setup').isString().withMessage('This field is only accept string value'),
    // body('suspension.compression.rear').notEmpty().withMessage('Provide suspension compression font settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.compression.rear.value').notEmpty().withMessage('Provide suspension compression font value for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.compression.rear.settings').notEmpty().withMessage('Provide suspension compression font settings for create vehicle setup').isString().withMessage('This field is only accept string value'),

    // body('suspension.rebound').notEmpty().withMessage('Provide suspension rebound settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.rebound.front').notEmpty().withMessage('Provide suspension rebound font settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.rebound.front.value').notEmpty().withMessage('Provide suspension rebound font value for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.rebound.front.settings').notEmpty().withMessage('Provide suspension rebound font settings for create vehicle setup').isString().withMessage('This field is only accept string value'),
    // body('suspension.rebound.rear').notEmpty().withMessage('Provide suspension rebound font settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('suspension.rebound.rear.value').notEmpty().withMessage('Provide suspension rebound font value for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('suspension.rebound.rear.settings').notEmpty().withMessage('Provide suspension rebound font settings for create vehicle setup').isString().withMessage('This field is only accept string value'),

    // body('sprockets').notEmpty().withMessage('Provide sprockets settings for create vehicle setup').isObject({ strict: true }).withMessage('This field is only accept object'),
    // body('sprockets.front').notEmpty().withMessage('Provide sprockets front settings for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
    // body('sprockets.rear').notEmpty().withMessage('Provide sprockets front settings for create vehicle setup').isNumeric().withMessage('This field is only accept numeric value'),
]

exports.deleteVehicleSetupValidation = [
    param('setupId').notEmpty().withMessage('Provide setup id for delete vehicle setup').isMongoId().withMessage('Provide valid setup id for delete vehicle setup'),
]

exports.getVehicleSetupsValidation = [
    param('vehicleGroupId').notEmpty().withMessage('Provide vehicle group id for get vehicle setup').isMongoId().withMessage('Provide valid vehicle group id for get vehicle setup'),
]