const { body, oneOf, query } = require("express-validator");
const UserModel = require("../models/UserModel");
const VehicleTypeModel = require("../models/VehicleTypeModel");

exports.uniqueCheckValidation = [
    oneOf([
        query("email").notEmpty().withMessage('Provide your email id').isEmail().withMessage('Provide valid email id'),
        query("phoneNumber").notEmpty().withMessage('Provide your phone number').isMobilePhone().withMessage('Provide valid phone number')
    ], { errorType: 'flat', message: 'Enter a valid E-Mail id/Mobile Number' })
]

exports.verifyDetailsValidation = [
    body("userDetails").notEmpty().withMessage('Enter valid E-Mail id/Mobile Number'),
    body("verification_code").notEmpty().withMessage('Provide your verification code').isLength({ min: 6, max: 6 }).withMessage('Provide valid activation code')
]

exports.registervalidation = [
    body("firstName").notEmpty().withMessage('Provide your first name'),
    body("lastName").notEmpty().withMessage('Provide your last name'),
    body("email").notEmpty().withMessage('Provide your email id').isEmail().withMessage('Provide valid email id').custom(async (value) => {
        await UserModel.findOne({ email: value }).then((result) => {
            if (result) {
                throw new Error('User already exists with this email id')
            } else {
                return true
            }
        })
    }),
    body("phoneNumber").notEmpty().withMessage('Provide your phone number').isMobilePhone().withMessage('Provide valid phone number').custom(async (value, { req }) => {
        await UserModel.findOne({ phoneNumber: value }).then((result) => {
            if (result) {
                throw new Error('Phone number is already exsist')
            } else {
                return true
            }
        })
    }),
    // body("image").notEmpty().withMessage('Provide your profile image'),
    body("password").notEmpty().withMessage('Provide your password'),
    body("location").notEmpty().withMessage('Provide your location'),
    body("vehicles").optional().isArray().withMessage('This field must be an array'),
    body("vehicles.*.CC").isNumeric().withMessage('This field only accept numaric value'),
    body("vehicles.*.vehicleTypeId").notEmpty().withMessage('This is a required field').isMongoId().withMessage("Provide vechile type id").custom((value) => {
        return VehicleTypeModel.findOne({ _id: value, isDeleted: false }).then((details) => {
            if (!details) {
                return Promise.reject("This vechile type is not exsist")
            }
        })
    }),
    body("vehicles.*.name").notEmpty().withMessage('Provide your vehicle name').isString().withMessage('This field only accept string value'),
    body("vehicles.*.nickname").notEmpty().withMessage('Provide your vehicle nick name'),
    // body("vehicles.*.registrationNumber").notEmpty().withMessage('Provide your vehicle registration number'),
    // body("vehicles.*.racingNumber").notEmpty().withMessage('Provide your vehicle racing number'),
    body("vehicles.*.chassisNumber").notEmpty().withMessage('Provide your vehicle chassis number'),
    body("vehicles.*.engineNumber").notEmpty().withMessage('Provide your vehicle engine number'),
]

exports.loginvalidation = [
    body("userName").notEmpty().withMessage('Provide your email id'),
    body("password").notEmpty().withMessage('Provide your password')
]

exports.forgetPasswordValidation = [
    body("userDetails").notEmpty().withMessage('Enter valid E-Mail id/Mobile Number').custom(async (value, { req }) => {
        await UserModel.findOne({ $or: [{ email: value.toLowerCase() }, { phoneNumber: value }] }).then((result) => {
            if (result) {
                req.userDetails = result
                return true
            } else {
                throw new Error('User is not exists')
            }
        })
    }),
]

exports.verifyOtpValidation = [
    body("code").notEmpty().withMessage('Provide valid change password verification code').isLength({ min: 6, max: 6 }).withMessage('Provide valid change password verification code'),
    body("userDetails").notEmpty().withMessage('Enter valid E-Mail id/Mobile Number').custom(async (value, { req }) => {
        await UserModel.findOne({ $or: [{ email: value.toLowerCase() }, { phoneNumber: value }] }).then((result) => {
            if (result) {
                req.userDetails = result
                return true
            } else {
                throw new Error('User is not exists')
            }
        })
    }),
]

exports.resetPasswordValidation = [
    body("userDetails").notEmpty().withMessage('Enter valid E-Mail id/Mobile Number').custom(async (value, { req }) => {
        await UserModel.findOne({ $or: [{ email: value.toLowerCase() }, { phoneNumber: value }] }).then((result) => {
            if (result) {
                req.userDetails = result
                return true
            } else {
                throw new Error('User is not exists')
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

exports.changePasswordUserValidation = [
    body("password").notEmpty().withMessage('Provide your password'),
    body("confirmPassword").notEmpty().withMessage('Provide your password again').custom((value, { req }) => {
        if (value == req.body.password) {
            return true
        } else {
            throw new Error('Password and Confirm password should be same')
        }
    })
]

exports.updateUserValidation = [
    body("firstName").optional().isString().withMessage('This field only accept string value').isLength({ min: 1 }).withMessage('Provide your first name to update your details'),
    body("lastName").optional().isString().withMessage('This field only accept string value').isLength({ min: 1 }).withMessage('Provide your last name to update your details'),
    body("phoneNumber").optional().isMobilePhone().withMessage('Provide valid phone number'),
    body("location").optional().isString().withMessage('This field only accept string value').isLength({ min: 1 }).withMessage('Provide your location to update your details'),
    body("image").optional().isString().withMessage('This field only accept string value').isLength({ min: 1 }).withMessage('Provide your profile image link'),
    body("weightFullGear").optional().isNumeric().withMessage('This field only accept number value')
]