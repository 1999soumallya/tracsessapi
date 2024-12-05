const { body, oneOf, query } = require("express-validator");
const OrganizerModel = require("../models/OrganizerModel");
const VehicleTypeModel = require("../models/VehicleTypeModel");

exports.uniquecheckvalidation = [
    oneOf([
        query("email").notEmpty().withMessage('Provide your email id').isEmail().withMessage('Provide valid email id'),
        query("phoneNumber").notEmpty().withMessage('Provide your phone number').isMobilePhone().withMessage('Provide valid phone number')
    ], { errorType: 'flat', message: 'Enter a valid E-Mail id/Mobile Number' })
]

exports.registerorganizervalidation = [
    body("name").notEmpty().withMessage('Provide your organization name'),
    body("email").notEmpty().withMessage('Provide your email id').isEmail().withMessage('Provide valid email id').custom(async (value) => {
        await OrganizerModel.findOne({ email: value }).then((result) => {
            if (result) {
                throw new Error('Organizer already exists with this email id')
            } else {
                return true
            }
        })
    }),
    body("phoneNumber").notEmpty().withMessage('Provide your phone number').isMobilePhone().withMessage('Provide valid phone number').custom(async (value) => {
        await OrganizerModel.findOne({ phoneNumber: value }).then((result) => {
            if (result) {
                throw new Error('Phone number is already exsist')
            } else {
                return true
            }
        })
    }),
    body("image").notEmpty().withMessage('Provide your profile image'),
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

    body("managingTrack").notEmpty().withMessage("Provide track management status").isBoolean().withMessage("This field only accept boolean value"),
    body("track").if(body("managingTrack").equals("true")).isObject().withMessage("This field only accept object"),
    body("track.name").if(body("managingTrack").equals("true")).notEmpty().withMessage("Provide track name").isString().withMessage("This field only accept string value"),
    body("track.location").if(body("managingTrack").equals("true")).notEmpty().withMessage("Provide track location").isString().withMessage("This field only accept string value"),
    body("track.address").if(body("managingTrack").equals("true")).notEmpty().withMessage("Provide track address").isString().withMessage("This field only accept string value"),
    body("track.image").if(body("managingTrack").equals("true")).notEmpty().withMessage("Provide track image").isString().withMessage("This field only accept string value"),
]

exports.loginorganizervalidation = [
    body("userName").notEmpty().withMessage('Provide your email id'),
    body("password").notEmpty().withMessage('Provide your password')
]

exports.forgetPasswordorganizervalidation = [
    body("email").notEmpty().withMessage('Provide your email id').isEmail().withMessage('Provide valid email id').custom(async (value, { req }) => {
        await OrganizerModel.findOne({ email: value }).then((result) => {
            if (result) {
                req.organizerdetails = result
                return true
            } else {
                throw new Error('Email id is not exsists')
            }
        })
    })
]

exports.resetPasswordorganizervalidation = [
    body("password").notEmpty().withMessage('Provide your password'),
    body("confirmPassword").notEmpty().withMessage('Provide your password again').custom((value, { req }) => {
        if (value == req.body.password) {
            return true
        } else {
            throw new Error('Password and Confirm password should be same')
        }
    })
]

exports.updateOrganizerValidation = [
    body("name").optional().isString().withMessage('This field only accept string value').isLength({ min: 1 }).withMessage('Provide your organizer name'),
    body("location").optional().isString().withMessage('This field only accept string value').isLength({ min: 1 }).withMessage('Provide your organizer location'),
    body("phoneNumber").optional().isMobilePhone().withMessage('Provide valid phone number'),
    body("image").optional().isString().withMessage('This field only accept string value').isLength({ min: 1 }).withMessage('Provide your organizer profile image link'),
    body("managingTrack").optional().isBoolean().withMessage("This field only accept boolean value"),

    body("track").if(body("managingTrack").exists()).if(body("managingTrack").equals("true")).isObject().withMessage("This field only accept object"),
    body("track.name").if(body("managingTrack").exists()).if(body("managingTrack").equals("true")).notEmpty().withMessage("Provide track name").isString().withMessage("This field only accept string value"),
    body("track.location").if(body("managingTrack").exists()).if(body("managingTrack").equals("true")).notEmpty().withMessage("Provide track location").isString().withMessage("This field only accept string value"),
    body("track.address").if(body("managingTrack").exists()).if(body("managingTrack").equals("true")).notEmpty().withMessage("Provide track address").isString().withMessage("This field only accept string value"),
    body("track.image").if(body("managingTrack").exists()).if(body("managingTrack").equals("true")).notEmpty().withMessage("Provide track image").isString().withMessage("This field only accept string value"),
]