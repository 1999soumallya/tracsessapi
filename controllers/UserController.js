const { encryptpassword, compairpassword, tokens, verifytoken, decodetoken, resettokens } = require("../helpers/UserHelper");
const TokenModel = require("../models/TokenModel");
const UserModel = require("../models/UserModel");
const Vehiclemodel = require("../models/VehiclesModel");
const moment = require("moment-timezone");
const CommonMessage = require("../helpers/CommonMessage");
const RidersModel = require("../models/RidersModel");
const { createInvitation } = require("../helpers/RiderHelpers");
const NotificationModel = require("../models/NotificationModel");
const { sendMail } = require("../helpers/MailHelper");
const otpGenerator = require('otp-generator');
const VerificationModel = require("../models/VerificationModel");
const { sendOTP } = require("../helpers/OtpHelper");

exports.uniqueCheck = async (req, res) => {
    try {

        const { email, phoneNumber } = req.query

        if (phoneNumber) {
            await UserModel.findOne({ phoneNumber }).then((result) => {
                if (result) {
                    return res.status(200).json({ message: CommonMessage.user.uniqueCheck.success, success: true })
                }
                const verification = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false })
                VerificationModel.findOneAndUpdate({ mobile: phoneNumber }, { mobile: phoneNumber, verification, expired: moment().utc().add(10, 'minutes').format() }, { new: true, upsert: true }).then((result) => {
                    sendOTP(result.countryCode + result.mobile, result.verification, 'OTP1').then((details) => {
                        return res.status(200).json({ message: CommonMessage.user.uniqueCheck.notfound, success: true, data: CommonMessage.user.uniqueCheck.with_sms })
                    }).catch((error) => {
                        return res.status(200).json({ message: CommonMessage.user.uniqueCheck.notfound, success: true, error: error.stack, data: CommonMessage.user.uniqueCheck.without_sms })
                    })
                })
            }).catch((error) => {
                res.status(500).json({ message: CommonMessage.user.uniqueCheck.failed, error: error.stack, success: false })
            })
        } else {
            UserModel.findOne({ email: { $regex: email, $options: "si" } }).then((result) => {
                if (result) {
                    return res.status(200).json({ message: CommonMessage.user.uniqueCheck.success, success: true })
                }

                const verification = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false })
                VerificationModel.findOneAndUpdate({ email: { $regex: email, $options: "si" } }, { email, verification, expired: moment().utc().add(10, 'minutes').format() }, { new: true, upsert: true }).then((result) => {
                    sendMail('public/template/RegistrationTemplate.html', { activation_code: result.verification, app_name: 'Tracess', logo_url: 'https://res.cloudinary.com/dl75ivwh4/image/upload/v1719435008/app%20images%20and%20icons/tracsess_logo_png.png' }, result.email, 'Your OTP for tracess Registration').then((details) => {
                        return res.status(200).json({ message: CommonMessage.user.uniqueCheck.notfound, success: true, data: CommonMessage.user.uniqueCheck.with_mail })
                    }).catch((error) => {
                        return res.status(200).json({ message: CommonMessage.user.uniqueCheck.notfound, success: false, error: error.stack, data: CommonMessage.user.uniqueCheck.without_mail })
                    })
                })
            }).catch((error) => {
                res.status(500).json({ message: CommonMessage.user.uniqueCheck.failed, error: error.stack })
            })
        }


    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.verifyDetails = async (req, res) => {
    try {
        const { userDetails, verification_code } = req.body

        const user_details = await UserModel.findOne({ $or: [{ email: { $regex: userDetails, $options: "si" } }, { phoneNumber: { $regex: userDetails, $options: "si" } }] })

        if (user_details) {
            return res.status(200).json({ message: 'You are already registered', success: false })
        }

        const verification_details = await VerificationModel.findOne({ $or: [{ email: { $regex: userDetails, $options: "si" } }, { mobile: { $regex: userDetails, $options: "si" } }] })

        if (!verification_details) {
            return res.status(200).json({ message: CommonMessage.user.verifyEmail.notFound, success: false })
        }

        if (moment().utc().isAfter(verification_details.expired)) {
            return res.status(200).json({ message: CommonMessage.user.verifyEmail.expired, success: false })
        }

        if (verification_code != verification_details.verification) {
            return res.status(200).json({ message: CommonMessage.user.verifyEmail.wrong, success: false })
        }

        VerificationModel.findByIdAndDelete(verification_details._id).then(() => {
            return res.status(200).json({ message: CommonMessage.user.verifyEmail.success, success: true })
        }).catch((error) => {
            return res.status(400).json({ message: CommonMessage.user.verifyEmail.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.register = async (req, res) => {
    try {
        let { firstName, lastName, email, phoneNumber, countryCode, password, location, vehicles, image, weightFullGear } = req.body

        const check_rider_invitation = await RidersModel.find({ $or: [{ riderDetails: email }, { riderDetails: phoneNumber }] })

        const verification_details = await VerificationModel.findOne({ email: { $regex: email, $options: "si" } })

        if (verification_details) {
            return res.status(200).json({ message: CommonMessage.user.register.notVerified, success: false })
        }

        UserModel.create({
            firstName, lastName, email: email.toLowerCase(), phoneNumber, countryCode, image, location, weightFullGear,
            activation: {
                code: otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false }),
                expired: moment().utc().add(10, 'minutes').format()
            },
            password: await encryptpassword(password),
            needSync: check_rider_invitation.length > 0 ? true : false
        }).then(async (details) => {
            if (vehicles && (vehicles.length > 0)) {
                vehicles = await vehicles.map((items) => ({ ...items, vehicleSource: 'OWN', user: details._id, vehicleType: items.vehicleTypeId }))
                await Vehiclemodel.insertMany(vehicles)
            }

            return res.status(200).json({ message: CommonMessage.user.register.success, success: true })
        }).catch((error) => {
            return res.status(200).json({ message: CommonMessage.user.register.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(400).json(CommonMessage.commonError(error))
    }
}

exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body

        UserModel.findOne({ $or: [{ email: { $regex: userName, $options: "si" } }, { phoneNumber: userName }] }).then(async (result) => {
            if (result) {
                if (await compairpassword(password, result.password)) {
                    if (result.isActive) {
                        res.status(200).json({ message: CommonMessage.user.login.success, success: true, data: result, needSync: result.needSync, token: await tokens(result._id) })
                    } else {
                        res.status(200).json({ message: CommonMessage.user.login.notActive, success: false })
                    }
                } else {
                    res.status(200).json({ message: CommonMessage.user.login.wrong, success: false })
                }
            } else {
                res.status(200).json({ message: CommonMessage.user.login.noUser, success: false })
            }
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.user.login.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        const { userDetails } = req.body

        const verification = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false })

        UserModel.findOneAndUpdate({ $or: [{ email: userDetails.toLowerCase() }, { phoneNumber: userDetails }] }, { resetPassword: { code: verification, time: moment().utc().add(10, 'minutes').format() } }, { new: true }).then((result) => {
            if (userDetails == result.phoneNumber) {
                sendOTP(result.countryCode + result.phoneNumber, result.resetPassword.code, 'OTP1').then((details) => {
                    return res.status(200).json({ message: CommonMessage.user.forgetPassword.mobileSuccess, success: true })
                }).catch((error) => {
                    return res.status(200).json({ message: CommonMessage.user.forgetPassword.mobileSuccess, success: true })
                })
            } else {
                sendMail('public/template/ForgotPasswordTemplate.html', { resend_code: result.resetPassword.code, app_name: 'Tracess', logo_url: 'https://res.cloudinary.com/dl75ivwh4/image/upload/v1719435008/app%20images%20and%20icons/tracsess_logo_png.png' }, result.email, 'OTP to Change Your Password for tracess').then((details) => {
                    return res.status(200).json({ message: CommonMessage.user.forgetPassword.success, success: true })
                }).catch((error) => {
                    return res.status(200).json({ message: CommonMessage.user.forgetPassword.success, success: true })
                })
            }
        }).catch((error) => {
            res.status(404).json({ message: CommonMessage.user.forgetPassword.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { code, userDetails } = req.body

        await UserModel.findOne({ $or: [{ email: userDetails.toLowerCase() }, { phoneNumber: userDetails }], "resetPassword.code": code }).then((userDetails) => {
            if (!userDetails) {
                return res.status(200).json({ message: CommonMessage.user.resetPassword.wrong, success: false })
            }

            if (moment().utc().isSameOrAfter(userDetails.resetPassword.time)) {
                return res.status(200).json({ message: CommonMessage.user.resetPassword.expired, success: false })
            }

            res.status(200).json({ message: CommonMessage.user.resetPassword.verified, success: true })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.user.resetPassword.verifyFailed, success: false, error: error.toString() })
        })

    } catch (error) { 
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { userDetails, password } = req.body

        const user_details = await UserModel.findOne({ $or: [{ email: userDetails.toLowerCase() }, { phoneNumber: userDetails }] })

        if (!user_details) {
            return res.status(200).json({ message: CommonMessage.user.resetPassword.notFound, success: false })
        }

        if (await compairpassword(password, user_details.password)) {
            return res.status(200).json({ message: CommonMessage.user.resetPassword.oldPassword, success: false })
        }

        await UserModel.findOneAndUpdate({ _id: user_details._id }, { password: await encryptpassword(password), resetPassword: { code: null, time: null } }, { new: true }).then(() => {
            res.status(200).json({ message: CommonMessage.user.resetPassword.success, success: true })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.user.resetPassword.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { userdetails } = req
        const { password } = req.body

        if (await compairpassword(password, userdetails.password)) {
            return res.status(200).json({ message: CommonMessage.user.changePassword.oldPassword, success: false })
        }

        await UserModel.findOneAndUpdate({ _id: userdetails._id }, { password: await encryptpassword(password) }, { new: true }).then(() => {
            res.status(200).json({ message: CommonMessage.user.changePassword.success, success: true })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.user.changePassword.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleUserDetails = async (req, res) => {
    try {
        const { userdetails } = req

        UserModel.findById(userdetails._id, { password: 0, resetPasswordCode: 0, resetPasswordAt: 0 }).populate([{ path: "vehicles", populate: { path: "vehicleType" } }, { path: "profile" }]).then((result) => {
            res.status(200).json({ message: result ? CommonMessage.getuserdetails.success : CommonMessage.getuserdetails.nouser, success: result ? true : false, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getuserdetails.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { userdetails } = req
        const { firstName, lastName, location, phoneNumber, image, weightFullGear } = req.body

        if (phoneNumber) {
            let user = await UserModel.findOne({ phoneNumber, _id: { $ne: userdetails._id } })
            if (user) {
                return res.status(200).json({ message: CommonMessage.user.updateDetails.mobileNumber, success: false })
            }
        }

        UserModel.findByIdAndUpdate(userdetails._id, { firstName, lastName, location, phoneNumber, image, weightFullGear }, { new: true, fields: "-password -resetPassword" }).then((result) => {
            res.status(200).json({ message: CommonMessage.user.updateDetails.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.user.updateDetails.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.userSync = async (req, res) => {
    try {
        const { userdetails } = req

        const user_details = await UserModel.findOne({ _id: userdetails._id })

        const rider_details = await RidersModel.find({ $or: [{ riderDetails: user_details.email }, { riderDetails: user_details.phoneNumber }] }).populate('creator')

        if (rider_details.length > 0) {
            for (let index = 0; index < rider_details.length; index++) {
                const element = rider_details[index];
                await RidersModel.findOneAndUpdate({ _id: element._id }, { rider: user_details._id, riderDetails: null, inviteLink: createInvitation(element.creator._id, user_details._id) }).then((details) => {
                    NotificationModel.create({ user: user_details._id, description: `You get a invitation from ${element.creator.name} to join the team`, category: 'riderInvitation', riderInvitation: details._id }).then(() => {
                        return true;
                    })
                })
            }
        }
        user_details.needSync = false;
        await user_details.save()

        return res.status(200).json({ message: CommonMessage.userSync.success, success: true })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}