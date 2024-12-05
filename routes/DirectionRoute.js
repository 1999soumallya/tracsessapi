const { addDirection, updateDirection, deleteDirection, toggleDirection, getAllDirection, getActiveDirection, getSingleDirection } = require('../controllers/DirectionController')
const validate = require('../helpers/Validation')
const { createDirectionValidation, updateDirectionValidation, commonDirectionValidation } = require('../validation/DirectionValidation')

const Router = require('express').Router()

Router.route('/create').post([createDirectionValidation, validate], addDirection)
Router.route('/update/:id').put([updateDirectionValidation, validate], updateDirection)
Router.route('/delete/:id').delete([commonDirectionValidation, validate], deleteDirection)
Router.route('/toggle/:id').patch([commonDirectionValidation, validate], toggleDirection)

Router.route('/get-all').get(getAllDirection)
Router.route('/get-active').get(getActiveDirection)
Router.route('/get-single/:id').get([commonDirectionValidation, validate], getSingleDirection)

module.exports = Router