const { body, param, query, oneOf } = require("express-validator");

exports.addRiderValidation = [
    oneOf([
        body('rider').isString().withMessage('Provide valid rider mobile number or email for add rider'),
        body('riderId').isMongoId().withMessage('Provide valid rider id for add rider in rider details')
    ], { message: 'Provide rider email or phone number or rider id for add rider', errorType: 'flat' }),
    body('eventId').notEmpty().withMessage('Provide event id for add rider').isMongoId('Provide valid event id for add rider')
]

exports.acceptInvitationValidation = [
    body('invitationLink').notEmpty().withMessage('Provide valid invitation link for accept')
]

exports.removeRiderValidation = [
    param('riderId').notEmpty().withMessage('Provide rider id for remove rider').isMongoId('Provide valid rider ship id for remove rider')
]

exports.getRiderValidation = [
    query('status').optional().isIn(['pending', 'accepted', 'declined']).withMessage('Accepted status are pending, accepted, declined'),
    param('eventId').notEmpty().withMessage('Provide event id for get rider details').isMongoId('Provide valid event id for get rider details')
]

exports.singleRiderValidation = [
    param('riderId').notEmpty().withMessage('Provide rider id for get rider details').isMongoId('Provide valid rider ship id for get rider details')
]

exports.searchRiderValidation = [
    query('search').notEmpty().withMessage('Provide rider details for search'),
    query('event_id').optional().isMongoId().withMessage('Provide valid event id for search')
]

exports.getRiderForSessionValidation = [
    param('session_id').notEmpty().withMessage('Provide valid session id for get rider details').isMongoId().withMessage('Provide valid session id for get rider details'),
]