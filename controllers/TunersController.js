const moment = require("moment-timezone");
const { tuners, commonError } = require("../helpers/CommonMessage");
const { encryptPassword, comparPassword, tokens, verifyToken, decodeToken, resetTokens } = require("../helpers/TunersHelper");
const TunersModel = require("../models/TunersModel");
const { uploadFileS3Client } = require("../helpers/Helpers");
const UUID = require('uuid');
const ImageGallery = require("../models/ImageGallery");
const CrewMembersModel = require("../models/CrewMembersModel");
const NotificationModel = require("../models/NotificationModel");
const otpGenerator = require('otp-generator');
const { sendMail } = require("../helpers/MailHelper");
const VerificationModel = require("../models/VerificationModel");
const { sendOTP } = require("../helpers/OtpHelper");

exports.uniqueCheck = async (req, res) => {
    try {

        const { email, phoneNumber } = req.query

        if (phoneNumber) {
            await TunersModel.findOne({ mobile: phoneNumber }).then((result) => {
                if (result) {
                    return res.status(200).json({ message: tuners.uniqueCheck.found })
                }
                const verification = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false })
                VerificationModel.findOneAndUpdate({ mobile: phoneNumber }, { mobile: phoneNumber, verification, expired: moment().utc().add(10, 'minutes').format() }, { new: true, upsert: true }).then((result) => {
                    sendOTP(result.countryCode + result.mobile, result.verification, 'OTP1').then((details) => {
                        return res.status(200).json({ message: tuners.uniqueCheck.notfound, success: true, data: tuners.uniqueCheck.with_sms })
                    }).catch((error) => {
                        return res.status(200).json({ message: tuners.uniqueCheck.notfound, success: true, error: error.stack, data: tuners.uniqueCheck.without_sms })
                    })
                })
            }).catch((error) => {
                res.status(400).json({ message: tuners.uniqueCheck.failed, error: error.stack })
            })
        } else {
            TunersModel.findOne({ email: { $regex: email, $options: "si" } }).then((result) => {
                if (result) {
                    return res.status(200).json({ message: tuners.uniqueCheck.found })
                }
                const verification = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false })
                VerificationModel.findOneAndUpdate({ email: { $regex: email, $options: "si" } }, { email, verification, expired: moment().utc().add(10, 'minutes').format() }, { new: true, upsert: true }).then((result) => {
                    sendMail('public/template/RegistrationTemplate.html', { activation_code: result.verification, app_name: 'Tracess Tuner', logo_url: 'https://res.cloudinary.com/dl75ivwh4/image/upload/v1719434709/app%20images%20and%20icons/tuner_logo.png' }, result.email, 'Your OTP for tracess tuner Registration').then((details) => {
                        return res.status(200).json({ message: tuners.uniqueCheck.notfound, success: true, data: tuners.uniqueCheck.with_mail })
                    }).catch((error) => {
                        return res.status(200).json({ message: tuners.uniqueCheck.notfound, success: true, error: error.stack, data: tuners.uniqueCheck.without_mail })
                    })
                })
            }).catch((error) => {
                res.status(400).json({ message: tuners.uniqueCheck.failed, error: error.stack })
            })
        }

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.verifyDetails = async (req, res) => {
    try {
        const { userDetails, verification_code } = req.body

        const tuner_details = await TunersModel.findOne({ $or: [{ email: { $regex: userDetails, $options: "si" } }, { mobile: { $regex: userDetails, $options: "si" } }] })

        if (tuner_details) {
            return res.status(200).json({ message: 'You are already registered', success: false })
        }

        const verification_details = await VerificationModel.findOne({ $or: [{ email: { $regex: userDetails, $options: "si" } }, { mobile: { $regex: userDetails, $options: "si" } }] })

        if (!verification_details) {
            return res.status(200).json({ message: tuners.verifyEmail.notFound, success: false })
        }

        if (moment().utc().isAfter(verification_details.expired)) {
            return res.status(200).json({ message: tuners.verifyEmail.expired, success: false })
        }

        if (verification_code != verification_details.verification) {
            return res.status(200).json({ message: tuners.verifyEmail.wrong, success: false })
        }

        VerificationModel.findByIdAndDelete(verification_details._id).then(() => {
            return res.status(200).json({ message: tuners.verifyEmail.success, success: true })
        }).catch((error) => {
            return res.status(400).json({ message: tuners.verifyEmail.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.register = async (req, res) => {
    try {

        let { name, mobile, countryCode, email, city, password, designationId, dateOfBirth, genderId, emergencyContactName, emergencyContactNumber, emergencyContactRelationId, specialization } = req.body
        let fileName, imagePatch

        const verification_details = await VerificationModel.findOne({ email: { $regex: email, $options: "si" } })

        if (verification_details) {
            return res.status(200).json({ message: tuners.register.notVerified, success: false })
        }

        if (req.file) {
            fileName = UUID.v4()
            imagePatch = await (await uploadFileS3Client(req.file, fileName, 'tunerProfileImages')).location
        }

        let specializationArray = specialization.map((items) => ({ category: items.categoryId, vehicleType: items.vehicleTypeId }))

        const crew_invitation = await CrewMembersModel.find({ $or: [{ memberDetails: email.toLowerCase() }, { memberDetails: mobile }] })

        TunersModel.create({
            name, mobile, countryCode, email, city, gender: genderId, image: imagePatch, password: await encryptPassword(password),
            designation: designationId, dateOfBirth: moment(dateOfBirth, 'DD-MM-YYYY HH:mm:ss').utc().format(), specialization: specializationArray,
            emergencyContact: {
                name: emergencyContactName,
                phoneNumber: emergencyContactNumber,
                relationship: emergencyContactRelationId
            },
            isActive: true,
            needSync: crew_invitation.length > 0 ? true : false,
        }).then(async (tunerDetails) => {
            if (req.file) {
                await ImageGallery.create({ tuners: tunerDetails._id, imagePatch: imagePatch, fileName })
            }
            return res.status(200).json({ message: tuners.register.success, success: true })

        }).catch((error) => {
            return res.status(400).json({ message: tuners.register.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(400).json(commonError(error))
    }
}

exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body

        TunersModel.findOne({ $or: [{ email: { $regex: userName, $options: "si" } }, { mobile: userName }] }).populate('designation gender specialization.vehicleType specialization.category').then(async (result) => {
            if (result) {
                if (await comparPassword(password, result.password)) {
                    if (result.isActive) {
                        res.status(200).json({ message: tuners.login.success, success: true, data: result, token: await tokens(result._id) })
                    } else {
                        res.status(200).json({ message: tuners.login.notActive, success: false })
                    }
                } else {
                    res.status(200).json({ message: tuners.login.wrong, success: false })
                }
            } else {
                res.status(200).json({ message: tuners.login.noTuners, success: false })
            }
        }).catch((error) => {
            res.status(400).json({ message: tuners.login.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.forgetPassword = async (req, res) => {
    try {

        const { userDetails } = req.body

        const verification = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false })

        TunersModel.findOneAndUpdate({ $or: [{ email: userDetails.toLowerCase() }, { mobile: userDetails }] }, { resetPassword: { code: verification, time: moment().utc().add(10, 'minutes').format() } }, { new: true }).then((result) => {
            if (userDetails == result.mobile) {
                sendOTP(result.countryCode + result.mobile, result.resetPassword.code, 'OTP1').then((details) => {
                    return res.status(200).json({ message: tuners.forgetPassword.mobileSuccess, success: true })
                }).catch((error) => {
                    return res.status(200).json({ message: tuners.forgetPassword.mobileSuccess, success: true })
                })
            } else {
                sendMail('public/template/ForgotPasswordTemplate.html', { resend_code: result.resetPassword.code, app_name: 'Tracess Tuner', logo_url: 'https://res.cloudinary.com/dl75ivwh4/image/upload/v1719434709/app%20images%20and%20icons/tuner_logo.png' }, result.email, 'OTP to Change Your Password for tracess tuner').then((details) => {
                    return res.status(200).json({ message: tuners.forgetPassword.success, success: true })
                }).catch((error) => {
                    return res.status(200).json({ message: tuners.forgetPassword.success, success: true })
                })
            }
        }).catch((error) => {
            res.status(404).json({ message: tuners.forgetPassword.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { code, userDetails } = req.body

        await TunersModel.findOne({ $or: [{ email: userDetails.toLowerCase() }, { mobile: userDetails }], "resetPassword.code": code }).then((tunerDetails) => {
            if (!tunerDetails) {
                return res.status(200).json({ message: tuners.resetPassword.wrong, success: false })
            }

            if (moment().utc().isSameOrAfter(tunerDetails.resetPassword.time)) {
                return res.status(200).json({ message: tuners.resetPassword.expired, success: false })
            }

            res.status(200).json({ message: tuners.resetPassword.verified, success: true })
        }).catch((error) => {
            res.status(400).json({ message: tuners.resetPassword.verifyFailed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}


exports.resetPassword = async (req, res) => {
    try {
        const { userDetails, password } = req.body

        const tunersDetails = await TunersModel.findOne({ $or: [{ email: userDetails.toLowerCase() }, { mobile: userDetails }] })

        if (!tunersDetails) {
            return res.status(200).json({ message: tuners.resetPassword.notFound, success: false })
        }

        if (await comparPassword(password, tunersDetails.password)) {
            return res.status(200).json({ message: tuners.resetPassword.oldPassword, success: false })
        }

        await TunersModel.findOneAndUpdate({ _id: tunersDetails._id }, { password: await encryptPassword(password), resetPassword: { code: null, time: null } }, { new: true }).then(() => {
            res.status(200).json({ message: tuners.resetPassword.success, success: true })
        }).catch((error) => {
            res.status(400).json({ message: tuners.resetPassword.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { password } = req.body

        if (await comparPassword(password, tunersDetails.password)) {
            return res.status(200).json({ message: tuners.changePassword.oldPassword, success: false })
        }

        await TunersModel.findOneAndUpdate({ _id: tunersDetails._id }, { password: await encryptPassword(password) }, { new: true }).then(() => {
            res.status(200).json({ message: tuners.changePassword.success, success: true })
        }).catch((error) => {
            res.status(400).json({ message: tuners.changePassword.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleTunersDetails = async (req, res) => {
    try {
        const { tunersDetails } = req

        TunersModel.findOne({ _id: tunersDetails._id }, { password: 0, resetPasswordCode: 0, resetPasswordAt: 0 }).populate('designation gender specialization.vehicleType specialization.category').then((result) => {
            res.status(200).json({ message: result ? tuners.getDetails.success : tuners.getDetails.noTuner, success: result ? true : false, data: result })
        }).catch((error) => {
            res.status(400).json({ message: tuners.getDetails.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updateTuner = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { name, mobile, city, designationId, dateOfBirth, genderId, emergencyContactName, emergencyContactNumber, emergencyContactRelationId, specialization, removeSpecialization } = req.body

        const tuner_details = await TunersModel.findOne({ _id: tunersDetails._id })

        let update = { name, city, designation: designationId, gender: genderId, emergencyContact: { name: tuner_details.emergencyContact.name, phoneNumber: tuner_details.emergencyContact.phoneNumber, relationship: tuner_details.emergencyContact.relationship } }

        if (emergencyContactName) {
            Object.assign(update.emergencyContact, { name: emergencyContactName })
        }

        if (emergencyContactNumber) {
            Object.assign(update.emergencyContact, { phoneNumber: emergencyContactNumber })
        }

        if (emergencyContactRelationId) {
            Object.assign(update.emergencyContact, { relationship: emergencyContactRelationId })
        }

        if (mobile) {
            let tuner = await TunersModel.findOne({ mobile, _id: { $ne: tunersDetails._id } })
            if (tuner) {
                return res.status(200).json({ message: tuners.updateDetails.mobileNumber, success: false })
            }
        }

        let fileName, imagePatch

        if (req.file) {
            fileName = UUID.v4()
            imagePatch = await (await uploadFileS3Client(req.file, fileName, 'tunerProfileImages')).location
            update.image = imagePatch
            await ImageGallery.create({ tuners: tunersDetails._id, imagePatch: imagePatch, fileName })
        }

        if (specialization && specialization.length > 0) {
            Object.assign(update, { $push: { specialization: specialization.map((items) => ({ category: items?.categoryId, vehicleType: items?.vehicleTypeId })) } })
        }

        if (removeSpecialization && removeSpecialization.length > 0) {
            await removeSpecialization.map(async (item) => {
                await TunersModel.findOneAndUpdate({ _id: tunersDetails._id }, { $pull: { specialization: { category: item?.categoryId, vehicleType: item?.vehicleTypeId, _id: item._id } } })
            })
        }

        if (dateOfBirth) {
            Object.assign(update, { dateOfBirth: moment(dateOfBirth, 'DD-MM-YYYY HH:mm:ss').utc().format() })
        }

        TunersModel.findOneAndUpdate({ _id: tunersDetails._id }, update, { new: true, fields: "-password -resetPassword" }, { new: true }).populate('designation gender specialization.vehicleType specialization.category').then((result) => {
            res.status(200).json({ message: tuners.updateDetails.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: tuners.updateDetails.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(commonError(error))
    }
}

exports.tunerSync = async (req, res) => {
    try {
        const { tunersDetails } = req

        const tuner_details = await TunersModel.findOne({ _id: tunersDetails._id })

        const rider_details = await CrewMembersModel.find({ $or: [{ memberDetails: tuner_details.email }, { memberDetails: tuner_details.mobile }] }).populate('member')

        if (rider_details.length > 0) {
            for (let index = 0; index < rider_details.length; index++) {
                const element = rider_details[index];
                await CrewMembersModel.findOneAndUpdate({ _id: element._id }, { rider: tuner_details._id, memberDetails: null, inviteLink: createInvitation(element.member._id, tuner_details._id) }).then((details) => {
                    NotificationModel.create({ tuners: tuner_details._id, description: `You get a invitation from ${element.creator.name} to join the team`, category: 'crewInvitation', riderInvitation: details._id }).then(() => {
                        return true;
                    })
                })
            }
        }
        tuner_details.needSync = false;
        await tuner_details.save()

        return res.status(200).json({ message: CommonMessage.userSync.success, success: true })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}