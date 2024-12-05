const { createSessionSetup, updateSessionSetup, getSessionSetup, deleteSessionSetup, getSingleSessionSetup, toggleSessionSetup, addRiders, removeRiders, addVehicle, removeVehicle, updateVehicle, cloneSetup, cloneSetupForSession } = require('../controllers/SessionSetupController')
const validate = require('../helpers/Validation')
const { isTuner } = require('../middleware')
const { createSessionSetupValidation, updateSessionSetupValidation, commonSessionSetupValidation, addRiderValidation, removeVehicleValidation, addVehicleValidation, getSingleSessionSetupValidation, getSessionSetupValidation, removeRiderValidation, cloneSetupForSessionValidation } = require('../validation/SessionSetupValidation')

const Router = require('express').Router()

Router.route('/create').post(isTuner, [createSessionSetupValidation, validate], createSessionSetup)
Router.route('/update/:session_setup_id').put(isTuner, [updateSessionSetupValidation, validate], updateSessionSetup)
Router.route('/get/:session_id').get(isTuner, [getSessionSetupValidation, validate], getSessionSetup)
Router.route('/get-single/:session_setup_id').get(isTuner, [getSingleSessionSetupValidation, validate], getSingleSessionSetup)
Router.route('/delete/:session_setup_id').delete(isTuner, [commonSessionSetupValidation, validate], deleteSessionSetup)
Router.route('/toggle/:session_setup_id').patch(isTuner, [commonSessionSetupValidation, validate], toggleSessionSetup)
Router.route('/clone-setup/:session_setup_id').get(isTuner, cloneSetup)
Router.route('/clone-setup-for-session').post(isTuner, [cloneSetupForSessionValidation, validate], cloneSetupForSession)

// Rider Section
Router.route('/add-rider/:session_setup_id').post(isTuner, [addRiderValidation, validate], addRiders)
Router.route('/remove-rider/:rider_group_id').delete(isTuner, [removeRiderValidation, validate], removeRiders)

// Vehicle Section
Router.route('/add-vehicle/:session_setup_id').post(isTuner, [addVehicleValidation, validate], addVehicle)
Router.route('/update-vehicle').put(isTuner, updateVehicle)
Router.route('/remove-vehicle/:session_setup_id').put(isTuner, [removeVehicleValidation, validate], removeVehicle)

module.exports = Router