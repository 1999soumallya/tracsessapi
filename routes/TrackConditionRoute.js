const { addCondition, updateCondition, deleteCondition, toggleCondition, getAllCondition, getActiveCondition, getSingleCondition } = require('../controllers/TrackConditionController')
const validate = require('../helpers/Validation')
const { createTrackConditionValidation, updateTrackConditionValidation, commonTrackConditionValidation } = require('../validation/TrackConditionValidation')

const Router = require('express').Router()

Router.route('/create').post([createTrackConditionValidation, validate], addCondition)
Router.route('/update/:id').put([updateTrackConditionValidation, validate], updateCondition)
Router.route('/delete/:id').delete([commonTrackConditionValidation, validate], deleteCondition)
Router.route('/toggle/:id').patch([commonTrackConditionValidation, validate], toggleCondition)

Router.route('/get-all').get(getAllCondition)
Router.route('/get-active').get(getActiveCondition)
Router.route('/get-single/:id').get([commonTrackConditionValidation, validate], getSingleCondition)

module.exports = Router