const Router = require("express").Router();

const { register, login, forgetPassword, resetPassword, updateOrganizer, getSingleOrganizerDetails, uniquecheck } = require("../controllers/OrganizerController")
const validate = require("../helpers/Validation");
const { isOrganizer } = require("../middleware");
const { registerorganizervalidation, loginorganizervalidation, forgetPasswordorganizervalidation, resetPasswordorganizervalidation, uniquecheckvalidation, updateOrganizerValidation } = require("../validation/OrganizerValidation")

Router.route('/unique-check').get([uniquecheckvalidation, validate], uniquecheck)

Router.route('/register').post([registerorganizervalidation, validate], register)
Router.route('/login').post([loginorganizervalidation, validate], login)
Router.route('/forgetpassword').post([forgetPasswordorganizervalidation, validate], forgetPassword)
Router.route('/resetPassword').post([resetPasswordorganizervalidation, validate], resetPassword)
Router.route('/update-organizer').put(isOrganizer, [updateOrganizerValidation, validate], updateOrganizer)

Router.route('/get-details').get(isOrganizer, getSingleOrganizerDetails)

module.exports = Router