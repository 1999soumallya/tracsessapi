const { createVehicleSetup, updateVehicleSetup, deleteVehicleSetup, getVehicleSetup, getSingleVehicleSetup } = require('../controllers/VehicleSetupController');
const validate = require('../helpers/Validation');
const { isTuner } = require('../middleware');
const { createVehicleSetupValidation, updateVehicleSetupValidation, deleteVehicleSetupValidation, getVehicleSetupsValidation } = require('../validation/VehicleSetupValidation');

const Router = require('express').Router();

Router.route('/create/:vehicleGroupId').post(isTuner, [createVehicleSetupValidation, validate], createVehicleSetup)
Router.route('/update/:setupId').put(isTuner, [updateVehicleSetupValidation, validate], updateVehicleSetup)
Router.route('/delete/:setupId').delete(isTuner, [deleteVehicleSetupValidation, validate], deleteVehicleSetup)
Router.route('/get-all/:vehicleGroupId').get(isTuner, [getVehicleSetupsValidation, validate], getVehicleSetup)
Router.route('/get-single/:setupId').get(isTuner, [deleteVehicleSetupValidation, validate], getSingleVehicleSetup)

module.exports = Router