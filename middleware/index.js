const CommonMessage = require("../helpers/CommonMessage");
const { verifytoken } = require("../helpers/OrganizerHelper");
const OrganizerModel = require("../models/OrganizerModel");
const TokenModel = require("../models/TokenModel");
const TunersModel = require("../models/TunersModel");
const UserModel = require("../models/UserModel");

exports.isOrganizer = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            let tunerToken = req.headers.authorization.split(" ")[1]

            await verifytoken(tunerToken).then(async () => {

                let tokendetails = await TokenModel.findOne({ token: tunerToken })

                if (!tokendetails) {
                    return res.status(401).json({ message: CommonMessage.middleware.validtoken, success: false })
                }

                req.tunerToken = tunerToken

                let organizerdetails = await OrganizerModel.findById(tokendetails.organizer)

                if (!organizerdetails) {
                    return res.status(401).json({ message: CommonMessage.middleware.unauthorized, success: false })
                }

                req.organizerdetails = organizerdetails

                next()

            }).catch((error) => {
                return res.status(401).json({ message: CommonMessage.middleware.validtoken, success: false })
            })

        } else {
            return res.status(401).json({ message: CommonMessage.middleware.requiretoken, success: false })
        }
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.isUser = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            let usertoken = req.headers.authorization.split(" ")[1]

            await verifytoken(usertoken).then(async () => {

                let tokendetails = await TokenModel.findOne({ token: usertoken })

                if (!tokendetails) {
                    return res.status(401).json({ message: CommonMessage.middleware.validtoken, success: false })
                }

                req.usertoken = usertoken

                let userdetails = await UserModel.findById(tokendetails.user)

                if (!userdetails) {
                    return res.status(401).json({ message: CommonMessage.middleware.unauthorized, success: false })
                }

                req.userdetails = userdetails

                next()

            }).catch((error) => {
                return res.status(401).json({ message: CommonMessage.middleware.validtoken, success: false })
            })

        } else {
            return res.status(401).json({ message: CommonMessage.middleware.requiretoken, success: false })
        }
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.isTuner = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            let tunerToken = req.headers.authorization.split(" ")[1]

            await verifytoken(tunerToken).then(async () => {

                let tokendetails = await TokenModel.findOne({ token: tunerToken })

                if (!tokendetails) {
                    return res.status(401).json({ message: CommonMessage.middleware.validtoken, success: false })
                }

                req.tunerToken = tunerToken

                let tunersDetails = await TunersModel.findOne({ _id: tokendetails.tuners }).populate('paramentCrewParticipant temporaryCrewParticipant')

                if (!tunersDetails) {
                    return res.status(401).json({ message: CommonMessage.middleware.unauthorized, success: false })
                }

                req.tunersDetails = tunersDetails
                req.paramentCrewParticipant = tunersDetails.paramentCrewParticipant
                req.temporaryCrewParticipant = tunersDetails.temporaryCrewParticipant

                next()

            }).catch((error) => {
                return res.status(401).json({ message: CommonMessage.middleware.validtoken, success: false, error: error.stack })
            })

        } else {
            return res.status(401).json({ message: CommonMessage.middleware.requiretoken, success: false })
        }
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.isAuthorized = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

            let token = req.headers.authorization.split(" ")[1]

            await verifytoken(token).then(async () => {

                let tokendetails = await TokenModel.findOne({ token: token })

                if (!tokendetails) {
                    return res.status(401).json({ message: CommonMessage.middleware.validtoken, success: false })
                }

                req.token = token

                let userdetails

                if (tokendetails.user) {
                    req.usertype = "user"
                    userdetails = await UserModel.findById(tokendetails.user)
                } else if (tokendetails.tuners) {
                    req.usertype = "tuners"
                    userdetails = await TunersModel.findById(tokendetails.tuners)
                } else {
                    req.usertype = "organizer"
                    userdetails = await OrganizerModel.findById(tokendetails.organizer)
                }

                if (!userdetails) {
                    return res.status(401).json({ message: CommonMessage.middleware.unauthorized, success: false })
                }

                req.userdetails = userdetails

                next()

            }).catch((error) => {
                return res.status(401).json({ message: CommonMessage.middleware.validtoken, success: false })
            })

        } else {
            return res.status(401).json({ message: CommonMessage.middleware.requiretoken, success: false })
        }
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}