const { createLaps, getLaps, getLapsUser, createMultipleLaps } = require('../controllers/LapsController')
const validate = require('../helpers/Validation')
const { isTuner, isUser } = require('../middleware')
const { createLapsValidation, getLapsValidation, getLapsUserValidation, createMultipleLapsValidation } = require('../validation/LapsValidation')

const Router = require('express').Router()

Router.route('/create').post(isTuner, [createLapsValidation, validate], createLaps)
Router.route('/create-multiple-driver-laps').post(isTuner, [createMultipleLapsValidation, validate], createMultipleLaps)
Router.route('/get-all/:vehicleSetupId').get(isTuner, [getLapsValidation, validate], getLaps)
Router.route('/get-all-user-laps/:sessionId').get(isUser, [getLapsUserValidation, validate], getLapsUser)

module.exports = Router