const { addTrack, updateTrack, deleteTrack, toggleTrack, getAllTrack, getActiveTrack, getSingleTrack } = require('../controllers/TrackController')
const { imageUpload } = require('../helpers/FileUpload')
const validate = require('../helpers/Validation')
const { addTrackValidation, updateTrackValidation, deleteTrackValidation, toggleTrackValidation, getTrackValidation } = require('../validation/TrackValidation')

const Router = require('express').Router()

Router.route('/create').post(imageUpload, [addTrackValidation, validate], addTrack)
Router.route('/update/:trackId').put(imageUpload, [updateTrackValidation, validate], updateTrack)
Router.route('/delete/:trackId').delete([deleteTrackValidation, validate], deleteTrack)
Router.route('/toggle/:trackId').patch([toggleTrackValidation, validate], toggleTrack)

Router.route('/get-all').get(getAllTrack)
Router.route('/get-active').get(getActiveTrack)
Router.route('/get-single/:trackId').get([getTrackValidation, validate], getSingleTrack)

module.exports = Router