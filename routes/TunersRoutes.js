const Router = require("express").Router();

const { register, login, uniqueCheck, forgetPassword, resetPassword, getSingleTunersDetails, updateTuner, tunerSync, verifyOtp, changePassword, verifyDetails } = require("../controllers/TunersController");
const { imageUpload } = require("../helpers/FileUpload");
const validate = require("../helpers/Validation");
const { isTuner } = require("../middleware");
const { convertJson } = require("../middleware/converMiddleware");
const { loginTunerValidation, uniqueCheckValidation, registerTunerValidation, forgetPasswordTunerValidation, resetPasswordTunerValidation, updateTunerValidation, verifyOtpValidation, changePasswordTunerValidation, verifyDetailsValidation } = require("../validation/TunersValidation");

Router.route('/unique-check').get([uniqueCheckValidation, validate], uniqueCheck)

Router.route('/register').post(imageUpload, convertJson, [registerTunerValidation, validate], register)
Router.route('/verify-details').post([verifyDetailsValidation, validate], verifyDetails)
Router.route('/login').post([loginTunerValidation, validate], login)
Router.route('/forget-password').post([forgetPasswordTunerValidation, validate], forgetPassword)
Router.route('/verify-otp').post([verifyOtpValidation, validate], verifyOtp)
Router.route('/reset-password').patch([resetPasswordTunerValidation, validate], resetPassword)
Router.route('/update-profile').put(isTuner, imageUpload, convertJson, [updateTunerValidation, validate], updateTuner)
Router.route('/change-password').patch(isTuner, [changePasswordTunerValidation, validate], changePassword)

Router.route('/get-details').get(isTuner, getSingleTunersDetails)
Router.route('/sync').get(isTuner, tunerSync)

module.exports = Router