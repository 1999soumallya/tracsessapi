const CommonMessage = require("../helpers/CommonMessage")

exports.convertJson = (req, res, next) => {
    try {

        let { fields } = req.body

        if (fields) {
            const fieldsArray = JSON.parse(fields)

            if (fieldsArray.length && fieldsArray.length > 0) {
                for (let index = 0; index < fieldsArray.length; index++) {
                    const element = fieldsArray[index];
                    req.body[element] = JSON.parse(req.body[element])
                }
                next()
            } else {
                next()
            }
        } else {
            next()
        }

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}