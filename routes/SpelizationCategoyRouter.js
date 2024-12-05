const { createCategory, updateCategory, deleteCategory, toggleCategory, getSingleCategory, getActiveCategories, getAllCategory } = require('../controllers/SpelizationCategoyController')
const validate = require('../helpers/Validation')
const { addSpecializationValidation, updateSpecializationValidation, commonSpecializationValidation } = require('../validation/SpelizationCategoyValidation')

const Router = require('express').Router()

Router.route('/create-category').post(addSpecializationValidation, validate, createCategory)
Router.route('/update-category/:id').put(updateSpecializationValidation, validate, updateCategory)
Router.route('/delete-category/:id').delete(commonSpecializationValidation, validate, deleteCategory)
Router.route('/toggle-category/:id').patch(commonSpecializationValidation, validate, toggleCategory)
Router.route('/get-category/:id').get(commonSpecializationValidation, validate, getSingleCategory)

Router.route('/get-active-category').get(getActiveCategories)
Router.route('/get-categories').get(getAllCategory)



module.exports = Router