const { body, param, oneOf } = require("express-validator");
const EventModel = require("../models/EventModel");
const PeriodModel = require("../models/PeriodModel");
const VehicleTypeModel = require("../models/VehicleTypeModel");
const TrackModel = require("../models/TrackModel");
const TunersEventModel = require("../models/TunersEventModel");

exports.addeventvalidation = [
    body("name").notEmpty().withMessage('Provide your event name'),
    body("image").notEmpty().withMessage('Provide your event image'),
    oneOf([
        [
            body("fromDate").isDate("DD-MM-YYYY").withMessage('Provide event start date DD-MM-YYYY format is only acceptable'),
            body("toDate").isDate("DD-MM-YYYY").withMessage('Provide event end date DD-MM-YYYY format is only acceptable'),
        ],
        body("date").isDate("DD-MM-YYYY").withMessage('Provide event date DD-MM-YYYY format is only acceptable'),
    ], { errorType: "flat", message: "Provide event start date ,end date or event date" }),

    body("location").notEmpty().withMessage('Provide your location'),
    body("address").notEmpty().withMessage('Provide your event address'),
    body("venue").notEmpty().withMessage('Provide your event venue'),
    body("description").notEmpty().withMessage('Provide your event description'),
    body("allowCarryForward").notEmpty().withMessage('Provide your event carry forward date').isBoolean().withMessage('This field only accept boolean value'),

    body("sessions").notEmpty().withMessage('Provide session array').isArray().withMessage('This field must be an array'),
    body("sessions.*.name").notEmpty().withMessage('Provide Session Name'),
    body("sessions.*.fromTime").notEmpty().withMessage('Provide session start time').isTime({ hourFormat: "hour24", mode: "default" }).withMessage('HH:mm format is only acceptable'),
    body("sessions.*.toTime").notEmpty().withMessage('Provide session end time').isTime({ hourFormat: "hour24", mode: "default" }).withMessage('HH:mm format is only acceptable'),
    body("sessions.*.vehicleTypeId").notEmpty().withMessage('Provide session accepted vehicle type Id').isMongoId().withMessage('This field only accept vehicle type id').custom(async (value) => {
        return VehicleTypeModel.findOne({ _id: value, isDeleted: false }).then((result) => {
            if (!result) {
                return Promise.reject("This vehicle type is not available")
            }
        })
    }),

    body("sessions.*.sameAsSession").if(body("sessions.*.vehicleCategories").not().exists()).isString().withMessage('Provide session name for same as session'),
    body("sessions.*.vehicleCategories").if(body("sessions.*.sameAsSession").not().exists()).isArray({ min: 1 }).withMessage('This field must be an array'),

    body("sessions.*.vehicleCategories.*.vehicleSource").notEmpty().withMessage('Provide vehicle source for this vehicle category').isIn(['ORG', 'OWN']).withMessage('This field only accept ORG and OWN'),
    body("sessions.*.vehicleCategories.*.slots").notEmpty().withMessage('Provide total slot for this vehicle category'),
    body("sessions.*.vehicleCategories.*.amount").notEmpty().withMessage('Provide slot price for this vehicle category'),

    body("sessions.*.vehicleCategories.*.period").notEmpty().withMessage('Provide available period for this vehicle category').isObject({ strict: true }).withMessage("This field only accept object type").custom(async (value, { req }) => {
        if (!value.periodid || !value.dependentfields) {
            throw new Error("This period is not a proper object format add periodid and dependentfields key in this object")
        } else {
            await PeriodModel.findOne({ _id: value.periodid, isDeleted: false, isActive: true }).then((details) => {
                if (!details) {
                    throw new Error("This period is not available provide correct period")
                } else if (details.dependentfields.length > 0) {
                    console.log(details.dependentfields);
                    for (let index = 0; index < details.dependentfields.length; index++) {
                        let field = details.dependentfields[index]
                        if (!Object.keys(value.dependentfields).includes(field)) {
                            throw new Error(`${field} field is required for this period`)
                        }
                    }

                } else {
                    return true
                }
            })
        }

    }),

    body("sessions.*.vehicleCategories.*.fromCC").if(body("sessions.*.vehicleCategories.*.CC").not().exists()).isNumeric().withMessage("Provide accepted vehicle start cc"),
    body("sessions.*.vehicleCategories.*.toCC").if(body("sessions.*.vehicleCategories.*.CC").not().exists()).isNumeric().withMessage("Provide accepted vehicle end cc"),

    body("sessions.*.vehicleCategories.*.CC").if(body("sessions.*.vehicleCategories.*.fromCC").not().exists() || body("sessions.*.vehicleCategories.*.toCC").not().exists()).isNumeric().withMessage("Provide accepted vehicle cc"),
]

exports.createEventValidation = [
    body("name").notEmpty().withMessage('Provide your event name for creating a event'),
    body("fromDate").notEmpty().withMessage('Provide your event start date for creating a event').isDate("DD-MM-YYYY").withMessage('Provide your event start date for creating a event and format will be'),
    body("toDate").notEmpty().withMessage('Provide your event end date for creating a event').isDate("DD-MM-YYYY").withMessage('Provide your event end date for creating a event and format will be'),
    body("location").notEmpty().withMessage('Provide your location for creating a event'),
    body("address").notEmpty().withMessage('Provide your event address for creating a event'),
    body("venue").notEmpty().withMessage('Provide your event venue for creating a event'),
    body("description").notEmpty().withMessage('Provide your event description for creating a event'),
    body("allowCarryForward").notEmpty().withMessage('Provide your event carry forward date for creating a event').isBoolean().withMessage('This field only accept boolean value'),
]

exports.updateeventvalidation = [
    param("id").notEmpty().withMessage('Provide event id').custom(async (value) => {
        await EventModel.findOne({ _id: value, isDeleted: false }).then((result) => {
            if (result) {
                return true
            } else {
                throw new Error('Provide correct event id')
            }
        })
    }),
    body("name").notEmpty().withMessage('Provide your event name'),
    oneOf([
        [
            body("fromDate").isDate("DD-MM-YYYY").withMessage('Provide event start date DD-MM-YYYY format is only acceptable'),
            body("toDate").isDate("DD-MM-YYYY").withMessage('Provide event end date DD-MM-YYYY format is only acceptable'),
        ],
        body("date").isDate("DD-MM-YYYY").withMessage('Provide event date DD-MM-YYYY format is only acceptable'),
    ], { errorType: "flat", message: "Provide event start date ,end date or event date" }),
    body("location").notEmpty().withMessage('Provide your location'),
    body("address").notEmpty().withMessage('Provide your event address'),
    body("venue").notEmpty().withMessage('Provide your event venue'),
    body("description").notEmpty().withMessage('Provide your event description'),
    body("allowCarryForward").notEmpty().withMessage('Provide your event carry forward date').isBoolean().withMessage('This field only accept boolean value'),
]

exports.deleteeventvalidation = [
    param("id").notEmpty().withMessage('Provide event id').custom(async (value) => {
        await EventModel.findOne({ _id: value, isDeleted: false }).then((result) => {
            if (result) {
                return true
            } else {
                throw new Error('Provide correct event id')
            }
        })
    })
]

exports.deleteeventnamevalidation = [
    param("event_name_id").notEmpty().withMessage('Provide event name id').isMongoId().withMessage('This field only accept MongoId value')
]

exports.bookEventValidation = [
    body("event").notEmpty().withMessage("Provide event id for booked").isMongoId().withMessage("Provide valid event id for booked"),
    body("sessionDetails").notEmpty().withMessage("Provide session details for bookings").isArray({ min: 1 }).withMessage("This field only accept array value and provide atlist one array"),
    body("sessionDetails.*.session").notEmpty().withMessage("Provide session id for booked").isMongoId().withMessage("Provide valid session id for booked"),
    body("sessionDetails.*.vehicleDetails").notEmpty().withMessage("Provide booking vehicle categorys").isArray({ min: 1 }).withMessage("This field only accept array value"),
    body("sessionDetails.*.vehicleDetails.*.vehicleCategoryId").notEmpty().withMessage("Provide vehicle category id for booked").isMongoId().withMessage("Provide valid vehicle category id for booked"),
    body("sessionDetails.*.vehicleDetails.*.selectedVehicles").notEmpty().withMessage("Provide selected vehicle id for booked").isArray({ min: 1 }).withMessage("This field only accept array of vehicle"),
    body("sessionDetails.*.vehicleDetails.*.selectedVehicles.*.vehicleId").notEmpty().withMessage("Provide vehicle id for booked").isMongoId().withMessage("Provide valid vehicle id for booked"),
    body("sessionDetails.*.vehicleDetails.*.selectedVehicles.*.duration").optional().isObject({ strict: true }).withMessage("Provide duration for booking vehicle category"),
]

exports.getSingleBookingValidation = [
    param("booking_id").notEmpty().withMessage("Provide booking id for getting details").isMongoId().withMessage("This field is only accept booking id to getting details")
]

exports.addTunerEventValidation = [
    body("eventName").notEmpty().withMessage('Provide your event name for creating event'),
    body("fromDate").notEmpty().withMessage('Provide event start date DD-MM-YYYY format is only acceptable').isDate("DD-MM-YYYY").withMessage('Provide event start date DD-MM-YYYY format is only acceptable'),
    body("toDate").notEmpty().withMessage('Provide event end date DD-MM-YYYY format is only acceptable').isDate("DD-MM-YYYY").withMessage('Provide event end date DD-MM-YYYY format is only acceptable'),
    body("track").notEmpty().withMessage('Provide your event track from create event').isMongoId().withMessage('Provide your event track from create event').custom(async (value) => {
        return TrackModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                return Promise.reject("This track is not available")
            } else {
                return Promise.resolve()
            }
        })
    }),
    body("eventSchedule").notEmpty().withMessage('Provide event details array for create event').isArray({min: 1}).withMessage('This field must be an array'),
    body("eventSchedule.*.date").notEmpty().withMessage('Provide date for create event').isDate("DD-MM-YYYY").withMessage('Provide event date DD-MM-YYYY format is only acceptable'),
    body("eventSchedule.*.sessions").notEmpty().withMessage('Provide session details array for create event').isArray({ min: 1 }).withMessage('This field must be an array'),
    body("eventSchedule.*.sessions.*.name").notEmpty().withMessage('Provide Session Name'),
    body("eventSchedule.*.sessions.*.fromTime").notEmpty().withMessage('Provide session start time'),
    body("eventSchedule.*.sessions.*.toTime").notEmpty().withMessage('Provide session end time'),
    body("eventSchedule.*.sessions.*.vehicleTypeId").notEmpty().withMessage('Provide session accepted vehicle type Id').isMongoId().withMessage('This field only accept vehicle type id').custom(async (value) => {
        return VehicleTypeModel.findOne({ _id: value, isDeleted: false }).then((result) => {
            if (!result) {
                return Promise.reject("This vehicle type is not available")
            } else {
                return Promise.resolve()
            }
        })
    })
]

exports.updateTunerEventValidation = [
    param('eventId').notEmpty().withMessage('Provide event id for update event').isMongoId().withMessage('Provide event id for update event').custom(async (value) => {
        return TunersEventModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                return Promise.reject("This event is not available")
            } else {
                return Promise.resolve()
            }
        })
    }),
    body("eventName").optional().isString().withMessage('Provide your event name for creating event').isLength({ min: 1 }).withMessage('Provide your event name for creating event'),
    body("fromDate").optional().isDate("DD-MM-YYYY").withMessage('Provide event start date DD-MM-YYYY format is only acceptable'),
    body("toDate").optional().isDate("DD-MM-YYYY").withMessage('Provide event end date DD-MM-YYYY format is only acceptable'),
    body("date").optional().isDate("DD-MM-YYYY").withMessage('Provide event date DD-MM-YYYY format is only acceptable'),
    body("track").optional().isMongoId().withMessage('Provide your event track from create event').custom(async (value) => {
        return TrackModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                return Promise.reject("This track is not available")
            } else {
                return Promise.resolve()
            }
        })
    }),
]

exports.deleteTunerEventValidation = [
    param('id').notEmpty().withMessage('Provide event id for delete event').isMongoId().withMessage('Provide event id for delete event').custom(async (value) => {
        return TunersEventModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                return Promise.reject("This event is not available")
            } else {
                return Promise.resolve()
            }
        })
    }),
]

exports.toggleTunerEventValidation = [
    param('id').notEmpty().withMessage('Provide event id for toggle event').isMongoId().withMessage('Provide event id for toggle event').custom(async (value) => {
        return TunersEventModel.findOne({ _id: value }).then((result) => {
            if (!result) {
                return Promise.reject("This event is not available")
            } else {
                return Promise.resolve()
            }
        })
    }),
]