const { addRelation, updateRelation, deleteRelation, toggleRelation, getAllRelation, getAllActiveRelation, getSingleRelation } = require('../controllers/RelationController')
const validate = require('../helpers/Validation')
const { createRelationValidation, updateRelationValidation, deleteRelationValidation, toggleRelationValidation, getRelationValidation } = require('../validation/RelationValidation')

const Router = require('express').Router()

Router.route('/create').post([createRelationValidation, validate], addRelation)
Router.route('/update/:id').put([updateRelationValidation, validate], updateRelation)
Router.route('/delete/:id').delete([deleteRelationValidation, validate], deleteRelation)
Router.route('/toggle/:id').patch([toggleRelationValidation, validate], toggleRelation)

Router.route('/get-all').get(getAllRelation)
Router.route('/get-single/:id').get([getRelationValidation, validate], getSingleRelation)
Router.route('/get-active').get(getAllActiveRelation)

module.exports = Router