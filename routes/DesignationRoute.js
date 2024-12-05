const { createDesignation, updateDesignation, deleteDesignation, toggleDesignation, getSingleDesignation, getActiveDesignation, getAllDesignation } = require('../controllers/DesignationController')
const validate = require('../helpers/Validation')
const { addDesignationValidation, updateDesignationValidation, commonDesignationValidation } = require('../validation/DesignationValidation')

const Router = require('express').Router()

Router.route('/create').post(addDesignationValidation, validate, createDesignation)
Router.route('/update/:id').put(updateDesignationValidation, validate, updateDesignation)
Router.route('/delete/:id').delete(commonDesignationValidation, validate, deleteDesignation)
Router.route('/toggle/:id').patch(commonDesignationValidation, validate, toggleDesignation)
Router.route('/get-single/:id').get(commonDesignationValidation, validate, getSingleDesignation)

Router.route('/get-active').get(getActiveDesignation)
Router.route('/get-all').get(getAllDesignation)



module.exports = Router