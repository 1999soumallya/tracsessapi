const { body, param } = require("express-validator");

exports.addPeriodValidation = [
    body("name").notEmpty().withMessage("Provide period name for create"),
    body("dependentfields").notEmpty().withMessage("Provide period dependecy field array").isArray().withMessage("This field only accept array value")
]

exports.commonPeriodValidation = [
    param("id").notEmpty().withMessage("Provide period name for create").isMongoId().withMessage("Provide period id for doing this operation"),
]