const Router = require('express').Router()
const validate = require('../helpers/Validation')
const { addvehiclecategory, updatevehiclecategory, deletevehiclecategory, togglevehiclecategory } = require('../controllers/VehicleCategoryController')
const { addvehiclecategoryvalidation, updatevehiclecategoryvalidation, deletevehiclecategoryvalidation } = require('../validation/VehicleCategoryValidation')
const { isOrganizer } = require('../middleware')

Router.route('/add-vehiclecategory').post(isOrganizer, [addvehiclecategoryvalidation, validate], addvehiclecategory)
Router.route('/update-vehiclecategory/:id').put(isOrganizer, updatevehiclecategory)
Router.route('/delete-vehiclecategory/:id').delete(isOrganizer, [deletevehiclecategoryvalidation, validate], deletevehiclecategory)
Router.route('/toggle-vehiclecategory/:id').patch(isOrganizer, [deletevehiclecategoryvalidation, validate], togglevehiclecategory)

module.exports = Router