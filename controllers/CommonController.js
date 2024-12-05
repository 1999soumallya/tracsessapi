const  CommonMessage = require("../helpers/CommonMessage")
const TokenModel = require("../models/TokenModel")

exports.Logout = (req, res) => {
    try {
        const { usertype, token, userdetails } =req

        TokenModel.findOneAndDelete({ [usertype]: userdetails._id, token }, { new: true }).then((details) => {
            if (details) {
                res.status(200).json({ message: CommonMessage.logout.success, success: true, data: details })
            } else {
                res.status(200).json({ message: CommonMessage.logout.notFound, success: false })
            }
        }).catch((err) => { 
            res.status(400).json({ message: CommonMessage.logout.failed, success: false, error: err.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}