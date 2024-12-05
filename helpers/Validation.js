const { validationResult } = require("express-validator");
const CommonMessage = require("./CommonMessage");

const validate = async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json(CommonMessage.validationError(validationResult(req).array()))
    }
    next()
}

module.exports = validate