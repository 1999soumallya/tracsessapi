const { body, oneOf, query } = require("express-validator");
const VehicleTypeModel = require("../models/VehicleTypeModel");
const TunersModel = require("../models/TunersModel");
const DesignationModel = require("../models/DesignationModel");
const SpecializationCategoryModel = require("../models/SpecializationCategoryModel");
const GenderModel = require("../models/GenderModel");
const RelationModel = require("../models/RelationModel");

exports.uniqueCheckValidation = [
    oneOf([
        query("email").notEmpty().withMessage('Provide your email id').isEmail().withMessage('Provide valid email id'),
        query("phoneNumber").notEmpty().withMessage('Provide your phone number').isMobilePhone().withMessage('Provide valid phone number')
    ], { errorType: 'flat', message: 'Enter a valid E-Mail id/Mobile Number' })
]

exports.registerTunerValidation = [
    body("name").notEmpty().withMessage('Provide your name'),
    body("mobile").notEmpty().withMessage('Provide your phone number').isMobilePhone().withMessage('Provide valid phone number').custom(async (value) => {
        return await TunersModel.findOne({ mobile: value }).then((result) => {
            if (result) {
                throw new Error('Phone number is already exists')
            } else {
                return true
            }
        })
    }),
    body("email").notEmpty().withMessage('Provide your email id').isEmail().withMessage('Provide valid email id').custom(async (value) => {
        return await TunersModel.findOne({ email: value }).then((result) => {
            if (result) {
                throw new Error('Tuner already exists with this email id')
            } else {
                return true
            }
        })
    }),
    body("city").notEmpty().withMessage('Provide your city name'),
    body("password").notEmpty().withMessage('Provide your password'),
    body('designationId').notEmpty().withMessage('Provide your designation from registration').isMongoId().withMessage('Provide valid designation id').custom(async (value) => {
        return await DesignationModel.findOne({ _id: value }).then((details) => {
            if (!details) {
                throw new Error('Designation is not exists')
            } else {
                return true
            }
        })
    }),
    body("dateOfBirth").notEmpty().withMessage('Provide your date of birth').isDate("DD-MM-YYYY").withMessage('Provide event start date DD-MM-YYYY format is only acceptable'),
    body("genderId").notEmpty().withMessage('Provide your gender').isMongoId().withMessage("Provide valid gender id").custom(async (value) => {
        return await GenderModel.findOne({ _id: value }).then((details) => {
            if (!details) {
                throw new Error('Gender is not exists')
            } else {
                return true
            }
        })
    }),
    body("emergencyContactName").notEmpty().withMessage('Provide your emergency contact person name'),
    body("emergencyContactNumber").notEmpty().withMessage('Provide your emergency contact person number').isMobilePhone().withMessage('Provide valid phone number'),
    body("emergencyContactRelationId").notEmpty().withMessage('Provide your emergency contact relation').isMongoId().withMessage("Provide valid relation id").custom(async (value) => {
        return await RelationModel.findOne({ _id: value }).then((details) => {
            if (!details) {
                throw new Error('Relation is not exists')
            } else {
                return true
            }
        })
    }),
    body("specialization").notEmpty().withMessage('Provide your at list one specialization').isArray({ min: 1 }).withMessage('Provide your at list one specialization'),
    body("specialization.*.vehicleTypeId").notEmpty().withMessage('Provide specialization vehicle type').isMongoId().withMessage('Provide valid vehicle type').custom(async (value) => {
        return await VehicleTypeModel.findOne({ _id: value }).then((details) => {
            if (!details) {
                throw new Error('Vehicle type is not exists')
            } else {
                return true
            }
        })
    }),
    body("specialization.*.categoryId").notEmpty().withMessage('Provide specialization description').isMongoId().withMessage('Provide valid specialization category').custom(async (value) => {
        return await SpecializationCategoryModel.findOne({ _id: value }).then((details) => {
            if (!details) {
                throw new Error('Specialization category is not exists')
            } else {
                return true
            }
        })
    })
]

exports.verifyDetailsValidation = [
    body("userDetails").notEmpty().withMessage('Enter valid E-Mail id/Mobile Number'),
    body("verification_code").notEmpty().withMessage('Provide your verification code').isLength({ min: 6, max: 6 }).withMessage('Provide valid activation code')
]

exports.loginTunerValidation = [
    body("userName").notEmpty().withMessage('Provide your email id'),
    body("password").notEmpty().withMessage('Provide your password')
]

exports.forgetPasswordTunerValidation = [
    body("userDetails").notEmpty().withMessage('Enter valid E-Mail id/Mobile Number').custom(async (value, { req }) => {
        await TunersModel.findOne({ $or: [{ email: value.toLowerCase() }, { mobile: value }] }).then((result) => {
            if (result) {
                req.tunerDetails = result
                return true
            } else {
                throw new Error('Tuner is not exists')
            }
        })
    })
]

exports.verifyOtpValidation = [
    body("userDetails").notEmpty().withMessage('Enter valid E-Mail id/Mobile Number').custom(async (value, { req }) => {
        await TunersModel.findOne({ $or: [{ email: value.toLowerCase() }, { mobile: value }] }).then((result) => {
            if (result) {
                req.tunerDetails = result
                return true
            } else {
                throw new Error('Tuner is not exists')
            }
        })
    }),
    body("code").notEmpty().withMessage('Provide valid change password verification code').isLength({ min: 6, max: 6 }).withMessage('Provide valid change password verification code'),
]

exports.resetPasswordTunerValidation = [
    body("userDetails").notEmpty().withMessage('Enter valid E-Mail id/Mobile Number').custom(async (value, { req }) => {
        await TunersModel.findOne({ $or: [{ email: value.toLowerCase() }, { mobile: value }] }).then((result) => {
            if (result) {
                req.tunerDetails = result
                return true
            } else {
                throw new Error('Tuner is not exists')
            }
        })
    }),
    body("password").notEmpty().withMessage('Provide your password'),
    body("confirmPassword").notEmpty().withMessage('Provide your password again').custom((value, { req }) => {
        if (value == req.body.password) {
            return true
        } else {
            throw new Error('Password and Confirm password should be same')
        }
    })
]

exports.changePasswordTunerValidation = [
    body("password").notEmpty().withMessage('Provide your password'),
    body("confirmPassword").notEmpty().withMessage('Provide your password again').custom((value, { req }) => {
        if (value == req.body.password) {
            return true
        } else {
            throw new Error('Password and Confirm password should be same')
        }
    })
]

exports.updateTunerValidation = [
    body("name").optional().isString().withMessage('Provide your name').isLength({ min: 1 }).withMessage('Provide your name'),
    body("mobile").optional().isMobilePhone().withMessage('Provide valid phone number'),
    body("city").optional().isString().withMessage('Provide your city name').isLength({ min: 1 }).withMessage('Provide your city name'),
    body('designationId').optional().isMongoId().withMessage('Provide valid designation id').custom(async (value) => {
        return await DesignationModel.findOne({ _id: value }).then((details) => {
            if (!details) {
                throw new Error('Designation is not exists')
            } else {
                return true
            }
        })
    }),
    body("dateOfBirth").optional().isDate("DD-MM-YYYY").withMessage('Provide event start date DD-MM-YYYY format is only acceptable'),
    body("genderId").optional().isMongoId().withMessage("Provide valid gender id").custom(async (value) => {
        return await GenderModel.findOne({ _id: value }).then((details) => {
            if (!details) {
                throw new Error('Gender is not exists')
            } else {
                return true
            }
        })
    }),
    body("emergencyContactName").optional().isString().withMessage('Provide your emergency contact person name').isLength({ min: 1 }).withMessage('Provide your emergency contact person name'),
    body("emergencyContactNumber").optional().isMobilePhone().withMessage('Provide valid phone number'),
    body("emergencyContactRelationId").optional().isMongoId().withMessage("Provide valid relation id").custom(async (value) => {
        return await RelationModel.findOne({ _id: value }).then((details) => {
            if (!details) {
                throw new Error('Relation is not exists')
            } else {
                return true
            }
        })
    }),
    body("specialization").optional().isArray().withMessage('At least 1 Specialization is required.'),
    body("specialization.*.vehicleTypeId").notEmpty().withMessage('Provide specialization vehicle type').isMongoId().withMessage('Provide valid vehicle type').custom(async (value) => {
        return await VehicleTypeModel.findOne({ _id: value }).then((details) => {
            if (!details) {
                throw new Error('Vehicle type is not exists')
            } else {
                return true
            }
        })
    }),
    body("specialization.*.categoryId").notEmpty().withMessage('Provide specialization description').isMongoId().withMessage('Provide valid specialization category').custom(async (value) => {
        return await SpecializationCategoryModel.findOne({ _id: value }).then((details) => {
            if (!details) {
                throw new Error('Specialization category is not exists')
            } else {
                return true
            }
        })
    })
]