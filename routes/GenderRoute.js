const { addGender, updateGender, deleteGender, toggleGender, getAllGender, getSingleGender, getAllActiveGender } = require('../controllers/GenderController')
const validate = require('../helpers/Validation')
const { createGenderValidation, updateGenderValidation, deleteGenderValidation, toggleGenderValidation, getGenderValidation } = require('../validation/GenderValidation')

const Router = require('express').Router()

Router.route('/create').post([createGenderValidation, validate], addGender)
Router.route('/update/:id').put([updateGenderValidation, validate], updateGender)
Router.route('/delete/:id').delete([deleteGenderValidation, validate], deleteGender)
Router.route('/toggle/:id').patch([toggleGenderValidation, validate], toggleGender)

Router.route('/get-all').get(getAllGender)
Router.route('/get-single/:id').get([getGenderValidation, validate], getSingleGender)
Router.route('/get-active').get(getAllActiveGender)

module.exports = Router