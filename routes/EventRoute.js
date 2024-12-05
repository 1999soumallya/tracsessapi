const Router = require('express').Router()
const { addevent, updateevent, deleteevent, toggleevent, getAllOrganizerEvent, getSingleEvent, cancleevent, deleteAllEvent, getAllOrganizerEventName, deleteSingleEventName, deleteAllEventName, getCurrentEvent, getCurrentEventUser, getSingleEventUser, getAllEvent, bookEvent, getAllBookings, getSingleBookings, createEvent } = require('../controllers/EventController')
const { addeventvalidation, deleteeventvalidation, deleteeventnamevalidation, bookEventValidation, getSingleBookingValidation, addTunerEventValidation, updateTunerEventValidation, deleteTunerEventValidation, toggleTunerEventValidation, createEventValidation } = require('../validation/EventValidation')
const { isOrganizer, isUser, isTuner } = require('../middleware')
const validate = require('../helpers/Validation')
const { addEvent, updateEvent, deleteEvent, deleteEvents, toggleEvent, cancelEvent, getAllTunerEvent, getEvent, getAllTunerEventName, deleteAllTunerEventName, deleteTunerEventName, getCurrentTunerEvent, getUserTunerEvent, getCurrentTunerEventUser, getSingleTunerEvent, getSingleCurrentTunerEvent, getSingleCurrentTunerEventUser } = require('../controllers/TunerEventController')
const { imageUpload } = require('../helpers/FileUpload')
const { convertJson } = require('../middleware/converMiddleware')

// Organizer Event Section
Router.route('/add-event').post(isOrganizer, [addeventvalidation, validate], addevent)
Router.route('/update-event/:id').put(isOrganizer, updateevent)
Router.route('/delete-event/:id').delete(isOrganizer, [deleteeventvalidation, validate], deleteevent)
Router.route('/delete-all-event').delete(isOrganizer, deleteAllEvent)
Router.route('/toggle-event/:id').patch(isOrganizer, [deleteeventvalidation, validate], toggleevent)
Router.route('/cancel-event/:id').patch(isOrganizer, [deleteeventvalidation, validate], cancleevent)

Router.route('/organizer/all-event').get(isOrganizer, getAllOrganizerEvent)
Router.route('/organizer/get-single-event/:event_id').get(isOrganizer, getSingleEvent)
Router.route('/organizer/get-current-event').get(isOrganizer, getCurrentEvent)

Router.route('/organizer/create').post(isOrganizer, imageUpload, [createEventValidation, validate], createEvent)

// User Event Section
Router.route('/user/all-event').get(isUser, getAllEvent)
Router.route('/user/get-single-event/:event_id').get(isUser, getSingleEventUser)
Router.route('/user/get-current-event').get(isUser, getCurrentEventUser)
Router.route('/user/get-all-tuner-event').get(isUser, getUserTunerEvent)
Router.route('/user/get-current-tuner-event').get(isUser, getCurrentTunerEventUser)
Router.route('/user/get-single-tuner-event/:event_id').get(isUser, getSingleTunerEvent)
Router.route('/user/get-current-event-single/:event_id').get(isUser, getSingleCurrentTunerEventUser)

// Organizer Event name Section
Router.route('/delete-single-event-name/:event_name_id').delete(isOrganizer, [deleteeventnamevalidation, validate], deleteSingleEventName)
Router.route('/delete-event-name').delete(isOrganizer, deleteAllEventName)
Router.route('/organizer/get-event-name').get(isOrganizer, getAllOrganizerEventName)

// Tuner Event Section
Router.route('/tuner/add-event').post(isTuner, [imageUpload, convertJson], [addTunerEventValidation, validate], addEvent)
Router.route('/tuner/update-event/:eventId').put(isTuner, [imageUpload, convertJson], [updateTunerEventValidation, validate], updateEvent)
Router.route('/tuner/delete-event/:id').delete(isTuner, [deleteTunerEventValidation, validate], deleteEvent)
Router.route('/tuner/delete-all-event').delete(isTuner, deleteEvents)
Router.route('/tuner/toggle-event/:id').patch(isTuner, [toggleTunerEventValidation, validate], toggleEvent)
Router.route('/tuner/cancel-event/:id').patch(isTuner, [toggleTunerEventValidation, validate], cancelEvent)
Router.route('/tuner/all-event').get(isTuner, getAllTunerEvent)
Router.route('/tuner/get-single-event/:event_id').get(isTuner, getEvent)
Router.route('/tuner/get-current-event').get(isTuner, getCurrentTunerEvent)
Router.route('/tuner/get-current-event-single/:event_id').get(isTuner, getSingleCurrentTunerEvent)


// Tuner Event name Section
Router.route('/tuner/delete-single-event-name/:event_name_id').delete(isTuner, [deleteeventnamevalidation, validate], deleteTunerEventName)
Router.route('/tuner/delete-event-name').delete(isTuner, deleteAllTunerEventName)
Router.route('/tuner/get-event-name').get(isTuner, getAllTunerEventName)

// User Booking Section
Router.route('/booked-event').post(isUser, [bookEventValidation, validate], bookEvent)
Router.route('/get-all-booked-event').get(isUser, getAllBookings)
Router.route('/get-single-booked-event/:booking_id').get(isUser, [getSingleBookingValidation, validate], getSingleBookings)

module.exports = Router