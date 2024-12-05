const Router = require('express').Router()
const validate = require('../helpers/Validation')
const { getSingleVehicle, getAllVehicleWeb, getAllVehicleMobile, deleteAllVehicle, addVehicle, updateVehicle, deleteVehicle, toggleVehicle, getUserVehicle } = require('../controllers/VehicleController')
const { toggleVehicleValidation, deleteVehicleValidation, updateVehicleValidation, addVehicleValidation, getRiderVehicleValidation } = require('../validation/VehicleValidation')
const { isAuthorized, isTuner } = require('../middleware')

Router.route('/add-vehicle').post(isAuthorized, [addVehicleValidation, validate], addVehicle)
Router.route('/update-vehicle/:id').put(isAuthorized, [updateVehicleValidation, validate], updateVehicle)
Router.route('/delete-vehicle').delete(isAuthorized, [deleteVehicleValidation, validate], deleteVehicle)
Router.route('/delete-all-vehicle').delete(isAuthorized, deleteAllVehicle)
Router.route('/toggle-vehicle/:id').patch(isAuthorized, [toggleVehicleValidation, validate], toggleVehicle)

Router.route('/get-single-vehicle/:vehicle_id').get(isAuthorized, getSingleVehicle)
Router.route('/web/all-vehicle').get(isAuthorized, getAllVehicleWeb)
Router.route('/mobile/all-vehicle').get(isAuthorized, getAllVehicleMobile)

Router.route('/get-rider-vehicle').post(isTuner, [getRiderVehicleValidation, validate], getUserVehicle)

module.exports = Router