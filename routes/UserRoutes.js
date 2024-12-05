const Router = require("express").Router();

const { register, login, forgetPassword, resetPassword, updateUser, getSingleUserDetails, uniqueCheck, userSync, verifyOtp, changePassword, verifyDetails } = require("../controllers/UserController")
const validate = require("../helpers/Validation");
const { isUser } = require("../middleware");
const { registervalidation, loginvalidation, forgetPasswordValidation, uniqueCheckValidation, updateUserValidation, verifyOtpValidation, resetPasswordValidation, changePasswordUserValidation, verifyDetailsValidation } = require("../validation/UserValidation")

Router.route('/unique-check').get([uniqueCheckValidation, validate], uniqueCheck)
Router.route('/verify-details').post([verifyDetailsValidation, validate], verifyDetails)
Router.route('/register').post([registervalidation, validate], register)
Router.route('/login').post([loginvalidation, validate], login)
Router.route('/forget-password').post([forgetPasswordValidation, validate], forgetPassword)
Router.route('/verify-otp').post([verifyOtpValidation, validate], verifyOtp)
Router.route('/reset-password').patch([resetPasswordValidation, validate], resetPassword)
Router.route('/update-user').put(isUser, [updateUserValidation, validate], updateUser)
Router.route('/change-password').patch(isUser, [changePasswordUserValidation, validate], changePassword)

Router.route('/get-details').get(isUser, getSingleUserDetails)
Router.route('/sync').get(isUser, userSync)

module.exports = Router