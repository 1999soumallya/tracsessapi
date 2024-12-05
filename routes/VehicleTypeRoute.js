const Router = require("express").Router()

const { addVehicleType, getAllVechileType, SearchVechileType, getSingleVechileType } = require("../controllers/VehileTypeController")
const validate = require("../helpers/Validation")
const { isAuthorized } = require("../middleware")
const { addVehicleTypevalidation, deleteVehicleTypevalidation, searchVehicleTypevalidation } = require("../validation/VehicleTypeValidation")


Router.route('/add-vehicle-type').post([addVehicleTypevalidation, validate], addVehicleType)
Router.route('/delete-vehicle-type/:vehicle_id').delete([deleteVehicleTypevalidation, validate], getAllVechileType)

Router.route('/get-all-vehicle-type').get(getAllVechileType).post(isAuthorized, [searchVehicleTypevalidation, validate], SearchVechileType)
Router.route('/get-single-vehicle-type/:vehicle_id').get(isAuthorized, getSingleVechileType)

module.exports = Router