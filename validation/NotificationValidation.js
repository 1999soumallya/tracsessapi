const { param } = require("express-validator");

exports.commonValidation = [
    param('notificationId').notEmpty().withMessage('Provide your notification id for perform this operation').isMongoId().withMessage('Provide your notification id for perform this operation')
]