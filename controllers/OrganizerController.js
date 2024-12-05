const CommonMessage = require("../helpers/CommonMessage");
const { encryptpassword, compairpassword, tokens, verifytoken, decodetoken, resettokens } = require("../helpers/OrganizerHelper");
const TokenModel = require("../models/TokenModel");
const OrganizerModel = require("../models/OrganizerModel");
const Vehiclemodel = require("../models/VehiclesModel");
const moment = require("moment-timezone");
const ProfileModel = require("../models/ProfileModel");

exports.uniquecheck = async (req, res) => {
    try {

        const { email, phoneNumber } = req.query

        if (phoneNumber) {
            await OrganizerModel.findOne({ phoneNumber }).then((result) => {
                if (result) {
                    return res.status(200).json({ message: CommonMessage.organizeremailcheck.success })
                }
                return res.status(200).json({ message: CommonMessage.organizeremailcheck.notfound })
            }).catch((error) => {
                res.status(400).json({ message: CommonMessage.organizeremailcheck.failed, error: error.stack })
            })
        } else {
            OrganizerModel.findOne({ email: { $regex: email, $options: "si" } }).then((result) => {
                if (result) {
                    return res.status(200).json({ message: CommonMessage.organizeremailcheck.success })
                }
                return res.status(200).json({ message: CommonMessage.organizeremailcheck.notfound })
            }).catch((error) => {
                res.status(400).json({ message: CommonMessage.organizeremailcheck.failed, error: error.stack })
            })
        }


    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.register = async (req, res) => {
    try {
        let { name, email, phoneNumber, countryCode, password, location, vehicles, image, managingTrack, track } = req.body

        let organizer = await OrganizerModel.create({ name, email, phoneNumber, countryCode, image, location, password: await encryptpassword(password) })

        await ProfileModel.create({ organizer: organizer._id, managingTrack, track })

        if (vehicles && (vehicles.length > 0)) {
            vehicles = await vehicles.map((items) => ({ ...items, vehicleSource: 'ORG', organizer: organizer.id, vehicleType: items.vehicleTypeId }))

            Vehiclemodel.insertMany(vehicles).then(() => {
                return res.status(200).json({ message: CommonMessage.registerOrganizer.success, success: true })
            }).catch((error) => {
                OrganizerModel.deleteOne({ _id: organizer._id }).then(() => {
                    return res.status(400).json({ message: CommonMessage.registerOrganizer.failed, success: false, error: error.stack })
                })
            })
        } else {
            return res.status(200).json({ message: CommonMessage.registerOrganizer.success, success: true })
        }

    } catch (error) {
        res.status(400).json(CommonMessage.commonError(error))
    }
}

exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body

        OrganizerModel.findOne({ $or: [{ email: { $regex: userName, $options: "si" } }, { phoneNumber: userName }] }).then(async (result) => {
            if (result) {
                if (await compairpassword(password, result.password)) {
                    if (result.isVerified) {
                        res.status(200).json({ message: CommonMessage.loginOrganizer.success, success: true, data: result, token: await tokens(result._id) })
                    } else {
                        res.status(200).json({ message: CommonMessage.loginOrganizer.notactive, success: false })
                    }
                } else {
                    res.status(200).json({ message: CommonMessage.loginOrganizer.wrong, success: false })
                }
            } else {
                res.status(200).json({ message: CommonMessage.loginOrganizer.noorganizer, success: false })
            }
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.loginOrganizer.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.forgetPassword = async (req, res) => {
    try {

        const { email } = req.body

        OrganizerModel.findOneAndUpdate({ email }, { resetPassword: { token: await resettokens(email), time: moment.utc().format() } }, { new: true }).then((result) => {
            TokenModel.deleteMany({ organizer: result._id })
            res.status(200).json({ message: CommonMessage.forgetPasswordOrganizer.success, success: true, data: result.resetPassword.token })
        }).catch((error) => {
            res.status(404).json({ message: CommonMessage.forgetPasswordOrganizer.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body

        if (!verifytoken(token)) {
            return res.status(400).json({ message: "Token Expired", success: false })
        }

        let tokendata = await decodetoken(token)

        const OrganizerModeldetails = await OrganizerModel.findOne({ email: tokendata.payload.id, "resetPassword.token": token })

        if (!OrganizerModeldetails) {
            return res.status(200).json({ message: CommonMessage.resetPasswordOrganizer.wrong, success: false })
        }

        if (await compairpassword(password, OrganizerModeldetails.password)) {
            return res.status(200).json({ message: CommonMessage.resetPasswordOrganizer.oldpassword, success: false })
        }

        await OrganizerModel.findOneAndUpdate({ email: tokendata.payload.id }, { password: await encryptpassword(password), resetPassword: { token: null, time: null } }, { new: true }).then(() => {
            res.status(200).json({ message: CommonMessage.resetPasswordOrganizer.success, success: true })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.resetPasswordOrganizer.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getSingleOrganizerDetails = async (req, res) => {
    try {
        const { organizerdetails } = req

        OrganizerModel.findById(organizerdetails._id, { password: 0, resetPasswordCode: 0, resetPasswordAt: 0 }).populate([{ path: "vehicles", populate: { path: "vehicleType" } }, { path: "profile" }]).then((result) => {
            res.status(200).json({ message: result ? CommonMessage.getorganizerdetails.success : CommonMessage.getorganizerdetails.noorganizer, success: result ? true : false, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getorganizerdetails.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.updateOrganizer = async (req, res) => {
    try {
        const { organizerdetails } = req
        const { name, location, phoneNumber, managingTrack, track, image } = req.body

        if (phoneNumber) {
            let organizer = await OrganizerModel.findOne({ phoneNumber, _id: { $ne: organizerdetails._id } })
            if (organizer) {
                return res.status(200).json({ message: "This phone number is already connected with different account", success: false })
            }
        }

        OrganizerModel.findByIdAndUpdate(organizerdetails._id, { name, location, phoneNumber, image }, { new: true, fields: "-password -resetPassword" }).then((result) => {
            ProfileModel.findOneAndUpdate({ organizer: result._id }, { managingTrack, track }, { new: true, fields: "-createdAt -updatedAt -organizer -_id" }).then((profile) => {
                res.status(200).json({ message: CommonMessage.updateOrganizer.success, success: true, data: { ...result?._doc, ...profile?._doc } })
            })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.updateOrganizer.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}