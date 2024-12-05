const CommonMessage = require("../helpers/CommonMessage");
const moment = require("moment-timezone");
const EventModel = require("../models/EventModel");
const SessionModel = require("../models/SessionModel");
const VehicleCategoryModel = require("../models/VehicleCategoryModel");
const { pagination, uploadFileS3Client } = require("../helpers/Helpers");
const EventNameModel = require("../models/EventNameModel");
const BookedModel = require("../models/BookedModel");
const VehiclesModel = require("../models/VehiclesModel");
const { validateBookingRequest } = require("../helpers/EventHelper");
const OrganizerModel = require("../models/OrganizerModel");
const UUID = require('uuid')

exports.addevent = async (req, res) => {
    try {
        const { name, image, fromDate, toDate, date, location, address, venue, description, allowCarryForward, sessions } = req.body
        const { organizerdetails } = req

        let eventname = await EventNameModel.findOneAndUpdate({ name: { $regex: name, $options: "si" }, organizer: organizerdetails._id }, { name: name.toLowerCase() }, { upsert: true, new: true })

        let insertObject = { name: eventname._id, image, location, address, venue, description, allowCarryForward, organizer: organizerdetails._id }

        if (date) {
            Object.assign(insertObject, { fromDate: moment(date, 'DD-MM-YYYY HH:mm:ss').utc().format(), toDate: moment(date, 'DD-MM-YYYY HH:mm:ss').utc().format(), date: moment(date, 'DD-MM-YYYY HH:mm:ss').utc().format() })
        }

        if (fromDate && toDate) {
            Object.assign(insertObject, { fromDate: moment(fromDate, 'DD-MM-YYYY HH:mm:ss').utc().format(), toDate: moment(toDate, 'DD-MM-YYYY HH:mm:ss').utc().format(), })
        }

        let event = await EventModel.create(insertObject)

        if (sessions && (sessions.length > 0)) {
            let addAllSession = await sessions.map(async (items) => {
                let sessionDetails = await SessionModel.create(items)

                if (items.sameAsSession) {
                    let sameAsSession = await sessions.find(((element) => element.name.toLowerCase() === items.sameAsSession.toLowerCase()))

                    if (sameAsSession.vehicleCategories && (sameAsSession.vehicleCategories.length > 0)) {

                        let vehicleCatagories = await VehicleCategoryModel.insertMany(sameAsSession.vehicleCategories)
                        sessionDetails.vehicleCategory = await vehicleCatagories.map((items) => (items._id))
                        sessionDetails.save()

                    }

                }

                if (items.vehicleCategories && (items.vehicleCategories.length > 0)) {

                    let vehicleCatagories = await VehicleCategoryModel.insertMany(items.vehicleCategories)
                    sessionDetails.vehicleCategory = await vehicleCatagories.map((items) => (items._id))
                    sessionDetails.save()

                }

                event = await EventModel.findByIdAndUpdate(event._id, { $push: { sessions: sessionDetails._id } }, { new: true }).populate([{
                    path: "sessions",
                    populate: [{ path: "vehicleCategory", match: { isDeleted: false } }, { path: "vehicleTypeId", match: { isDeleted: false } }],
                    match: { isDeleted: false }
                }, { path: "name" }])
            })

            await Promise.all(addAllSession).then((result) => {
                return res.status(200).json({ message: CommonMessage.addEvent.success, success: true, data: event })
            }).catch((error) => {
                res.status(400).json({ message: CommonMessage.addEvent.failed, success: false, error: error.toString() })
            })

        } else {
            return res.status(200).json({ message: CommonMessage.addEvent.success, success: true, data: details })
        }

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.createEvent = async (req, res) => {
    try {
        const { organizerdetails } = req
        const { name, fromDate, toDate, location, address, venue, description, allowCarryForward, sessions } = req.body

        let image, eventname = await EventNameModel.findOneAndUpdate({ name: { $regex: name, $options: "si" }, organizer: organizerdetails._id }, { name: name.toLowerCase() }, { upsert: true, new: true })

        if (!req.file) {
            return res.status(400).json({ message: CommonMessage.event.create.noImage, success: false })
        }

        if (req.file) {
            image = await (await uploadFileS3Client(req.file, UUID.v4(), 'eventImages')).location
        }

        EventModel.create({ name: eventname._id, image, fromDate: moment(fromDate, 'DD-MM-YYYY HH:mm:ss').utc().format(), toDate: moment(toDate, 'DD-MM-YYYY HH:mm:ss').utc().format(), location, address, venue, description, allowCarryForward, organizer: organizerdetails._id }).then(async (details) => {
            details = await EventNameModel.populate(details, { path: 'name', select: 'name' })
            res.status(200).json({ message: CommonMessage.event.create.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.event.create.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.updateevent = async (req, res) => {
    try {
        const { id } = req.params
        const { organizerdetails } = req
        const { name, fromDate, toDate, date, location, address, venue, description, allowCarryForward, image } = req.body

        let updateobject = { image, location, address, venue, description, allowCarryForward, }

        if (date) {
            Object.assign(insertobject, { fromDate: moment(date, 'DD-MM-YYYY').format(), toDate: moment(date, 'DD-MM-YYYY').format(), })
            updateobject.date = moment(date, 'DD-MM-YYYY').format()
        }

        if (fromDate && toDate) {
            Object.assign(updateobject, { fromDate: moment(fromDate, 'DD-MM-YYYY').format(), toDate: moment(toDate, 'DD-MM-YYYY').format(), })
        }

        await EventNameModel.findOneAndUpdate({ name: { $regex: name, $options: "si" }, organizer: organizerdetails._id }, { name: name.toLowerCase() }, { upsert: true, new: true })

        EventModel.findOneAndUpdate({ _id: id, organizer: organizerdetails._id }, updateobject, { new: true }).populate([{
            path: "sessions",
            populate: [{ path: "vehicleCategory", match: { isDeleted: false } }, { path: "vehicleTypeId", match: { isDeleted: false } }],
            match: { isDeleted: false }
        }, { path: "name" }]).then((details) => {
            res.status(200).json({ message: details ? CommonMessage.updateEvent.success : CommonMessage.updateEvent.eventnotfound, success: details ? true : false, data: details })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.updateEvent.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deleteevent = async (req, res) => {
    try {

        const { id } = req.params
        const { organizerdetails } = req

        if (!await EventModel.findOne({ _id: id, organizer: organizerdetails._id, isDeleted: false })) {
            return res.status(200).json({ message: CommonMessage.deleteEvent.eventnotfound, success: false })
        }

        EventModel.findOneAndUpdate({ _id: id, organizer: organizerdetails._id }, { isDeleted: true }).populate({ path: "sessions" }).then(async (details) => {
            let vehicleCategory = []
            let sessionid = []
            await details.sessions.map((items) => {
                vehicleCategory.push(...items.vehicleCategory)
                sessionid.push(items._id)
            })

            SessionModel.updateMany({ _id: { $in: sessionid } }, { isDeleted: true }).then(() => {
                VehicleCategoryModel.updateMany({ _id: { $in: vehicleCategory } }, { isDeleted: true }).then(() => {
                    res.status(200).json({ message: CommonMessage.deleteEvent.success, success: true })
                })
            })

        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.deleteEvent.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deleteAllEvent = async (req, res) => {
    try {
        const { organizerdetails } = req

        let events = await EventModel.find({ organizer: organizerdetails._id, isDeleted: false }).populate("sessions")

        let sessionarray = []
        let vehicleCategoriesArray = []

        events.map((items) => {
            items.sessions.map((item) => {
                sessionarray.push(item._id)
                vehicleCategoriesArray.push(...item.vehicleCategory)
            })
        })

        VehicleCategoryModel.updateMany({ _id: { $in: vehicleCategoriesArray } }, { isDeleted: true }).then(() => {
            SessionModel.updateMany({ _id: { $in: sessionarray } }, { isDeleted: true }).then(() => {
                EventModel.updateMany({ organizer: organizerdetails._id }, { isDeleted: true }).then(() => {
                    res.status(200).json({ message: CommonMessage.deleteEvent.success, success: true })
                })
            })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.deleteEvent.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(400).json(CommonMessage.commonError(error))
    }
}

exports.toggleevent = async (req, res) => {
    try {
        const { id } = req.params
        const { organizerdetails } = req

        const eventdetails = await EventModel.findOne({ _id: id, organizer: organizerdetails._id, isDeleted: false })

        if (!eventdetails) {
            return res.status(200).json({ message: CommonMessage.toggleEvent.eventnotfound, success: false })
        }

        EventModel.findOneAndUpdate({ _id: id, organizer: organizerdetails._id, isDeleted: false }, { isActive: !eventdetails.isActive }, { new: true }).populate({ path: "sessions" }).then(async (result) => {
            let vehicleCategory = []
            let sessionid = []
            await result.sessions.map((items) => {
                vehicleCategory.push(...items.vehicleCategory)
                sessionid.push(items._id)
            })

            SessionModel.updateMany({ _id: { $in: sessionid }, isDeleted: false }, { isActive: !eventdetails.isActive }).then(() => {
                VehicleCategoryModel.updateMany({ _id: { $in: vehicleCategory }, isDeleted: false }, { isActive: !eventdetails.isActive }).then(() => {
                    res.status(200).json({ message: result.isActive ? CommonMessage.toggleEvent.active : CommonMessage.toggleEvent.deactive, success: true })
                })
            })

        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.toggleEvent.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.cancleevent = async (req, res) => {
    try {
        const { id } = req.params
        const { organizerdetails } = req

        const eventdetails = await EventModel.findOne({ _id: id, organizer: organizerdetails._id, isDeleted: false })

        if (!eventdetails) {
            return res.status(200).json({ message: CommonMessage.cancleEvent.eventnotfound, success: false })
        }

        if (eventdetails.isCanceled) {
            return res.status(200).json({ message: CommonMessage.cancleEvent.already, success: false })
        }

        EventModel.findOneAndUpdate({ _id: id, organizer: organizerdetails._id, isDeleted: false }, { isCanceled: true }, { new: true }).populate({ path: "sessions" }).then(async (result) => {
            let vehicleCategory = []
            let sessionid = []
            await result.sessions.map((items) => {
                vehicleCategory.push(...items.vehicleCategory)
                sessionid.push(items._id)
            })

            SessionModel.updateMany({ _id: { $in: sessionid }, isDeleted: false }, { isCanceled: result.isCanceled }).then(() => {
                VehicleCategoryModel.updateMany({ _id: { $in: vehicleCategory }, isDeleted: false }, { isCanceled: result.isCanceled }).then(() => {
                    BookedModel.updateMany({ event: result._id }, { isCanceled: true }).then(() => {
                        res.status(200).json({ message: CommonMessage.cancleEvent.success, success: true })
                    })
                })
            })

        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.cancleEvent.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getSingleEvent = async (req, res) => {
    try {
        const { organizerdetails } = req
        const { event_id } = req.params

        EventModel.findOne({ _id: event_id, organizer: organizerdetails._id, isDeleted: false }).populate([
            {
                path: "sessions",
                populate: [
                    {
                        path: "vehicleCategory",
                        match: {
                            isDeleted: false
                        },
                        populate: [
                            {
                                path: 'period.periodid',
                                match: { isDeleted: false }
                            },
                            {
                                path: "bookings",
                                match: { isDeleted: false },
                                select: "user vehiclesBooked",
                                populate: [
                                    {
                                        path: "vehiclesBooked.vehicleId",
                                        match: { isDeleted: false },
                                    },
                                    {
                                        path: "user",
                                        select: "firstName lastName email phoneNumber"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: "vehicleTypeId",
                        match: {
                            isDeleted: false
                        }
                    },
                ],
                match: {
                    isDeleted: false
                }
            },
            {
                path: "name"
            }
        ]).then((result) => {
            res.status(200).json({ message: result ? CommonMessage.singleEvent.success : CommonMessage.singleEvent.noEvent, success: result ? true : false, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEvent.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getSingleEventUser = async (req, res) => {
    try {
        const { event_id } = req.params

        EventModel.findOne({ _id: event_id, isDeleted: false, fromDate: { $gte: moment().startOf("day").format() } }).populate([
            {
                path: "organizer",
                select: "name email phoneNumber countryCode image location vehicles",
            },
            {
                path: "sessions",
                populate: [
                    {
                        path: "vehicleCategory",
                        match: {
                            isDeleted: false
                        },
                        populate: [
                            {
                                path: 'period.periodid',
                                match: { isDeleted: false }
                            },
                            {
                                path: 'organizerVehicleId',
                                match: { isDeleted: false }
                            },
                        ]
                    },
                    {
                        path: "vehicleTypeId",
                        match: {
                            isDeleted: false
                        }
                    },
                ],
                match: {
                    isDeleted: false
                }
            },
            {
                path: "name"
            }
        ]).then((result) => {
            res.status(200).json({ message: result ? CommonMessage.singleEvent.success : CommonMessage.singleEvent.noEvent, success: result ? true : false, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEvent.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getAllOrganizerEvent = async (req, res) => {
    try {

        const { organizerdetails } = req

        let totalpage = await EventModel.countDocuments({ organizer: organizerdetails._id, isDeleted: false })
        let paginationdetails = pagination(req.query.limit ? req.query.limit : 10, req.query.page ? req.query.page : 1, totalpage)

        EventModel.find({ organizer: organizerdetails._id, isDeleted: false }).populate([{
            path: "sessions",
            populate: [
                {
                    path: "vehicleCategory",
                    match: {
                        isDeleted: false
                    },
                    populate: [
                        {
                            path: 'period.periodid',
                            match: { isDeleted: false }
                        },
                        {
                            path: "bookings",
                            match: { isDeleted: false },
                            select: "user vehiclesBooked",
                            populate: [
                                {
                                    path: "vehiclesBooked.vehicleId",
                                    match: { isDeleted: false },
                                },
                                {
                                    path: "user",
                                    select: "firstName lastName email phoneNumber"
                                }
                            ]
                        }
                    ]
                },
                {
                    path: "vehicleTypeId",
                    match: {
                        isDeleted: false
                    }
                },
            ],
            match: {
                isDeleted: false
            }
        }, { path: "name" }]).sort({ fromDate: -1 }).skip(paginationdetails.skip).limit(paginationdetails.limit).then((result) => {
            res.status(200).json({ message: (result.length > 0) ? CommonMessage.getEvent.success : CommonMessage.getEvent.noEvent, success: (result.length > 0) ? true : false, data: result, pagination: paginationdetails })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEvent.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getAllEvent = async (req, res) => {
    try {
        let totalpage = await EventModel.countDocuments({ isDeleted: false })
        let paginationdetails = pagination(req.query.limit ? req.query.limit : 10, req.query.page ? req.query.page : 1, totalpage)

        EventModel.find({ isDeleted: false, fromDate: { $gte: moment().startOf("day").format() } }).populate([
            {
                path: "organizer",
                select: "name email phoneNumber countryCode image location vehicles",
            },
            {
                path: "sessions",
                populate: [
                    {
                        path: "vehicleCategory",
                        match: {
                            isDeleted: false
                        },
                        populate: [
                            {
                                path: 'period.periodid',
                                match: { isDeleted: false }
                            },
                            {
                                path: 'organizerVehicleId',
                                match: { isDeleted: false }
                            },
                        ]
                    },
                    {
                        path: "vehicleTypeId",
                        match: {
                            isDeleted: false
                        }
                    },
                ],
                match: {
                    isDeleted: false
                }
            },
            {
                path: "name"
            }
        ]).sort({ createdAt: -1 }).skip(paginationdetails.skip).limit(paginationdetails.limit).then((result) => {
            res.status(200).json({ message: (result.length > 0) ? CommonMessage.getEvent.success : CommonMessage.getEvent.noEvent, success: (result.length > 0) ? true : false, data: result, pagination: paginationdetails })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEvent.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getAllOrganizerEventName = async (req, res) => {
    try {

        const { organizerdetails } = req
        const search = req.query.search ? req.query.search : ""

        let totalpage = await EventNameModel.countDocuments({ name: { $regex: search, $options: "si" }, organizer: organizerdetails._id, isDeleted: false })
        let paginationdetails = pagination(req.query.limit ? req.query.limit : 10, req.query.page ? req.query.page : 1, totalpage)

        EventNameModel.find({ name: { $regex: search, $options: "si" }, organizer: organizerdetails._id, isDeleted: false }).skip(paginationdetails.skip).limit(paginationdetails.limit).then((result) => {
            res.status(200).json({ message: (result.length > 0) ? CommonMessage.getEventName.success : CommonMessage.getEventName.noEvent, success: (result.length > 0) ? true : false, data: result, pagination: paginationdetails })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEventName.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deleteSingleEventName = async (req, res) => {
    try {
        const { organizerdetails } = req
        const { event_name_id } = req.params

        EventNameModel.findOneAndUpdate({ isDeleted: false, _id: event_name_id, organizer: organizerdetails._id }, { isDeleted: true }, { new: true }).then((details) => {
            res.status(200).json({ message: details ? CommonMessage.deleteSingleName.success : CommonMessage.deleteSingleName.noEvent, success: details ? true : false, data: details })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.deleteSingleName.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deleteAllEventName = async (req, res) => {
    try {
        const { organizerdetails } = req

        EventNameModel.updateMany({ isDeleted: false, organizer: organizerdetails._id }, { isDeleted: true }, { new: true }).then((details) => {
            res.status(200).json({ message: (details.matchedCount > 0) ? CommonMessage.deleteEventName.success : CommonMessage.deleteEventName.noEvent, success: details ? true : false, data: details })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.deleteEventName.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getCurrentEvent = async (req, res) => {
    try {

        const { organizerdetails } = req

        EventModel.find({
            organizer: organizerdetails._id,
            $expr: {
                $eq: [
                    { $dateToString: { format: '%Y-%m-%d', date: '$$NOW' } },
                    { $dateToString: { format: '%Y-%m-%d', date: '$fromDate' } },
                ],
            },
            toDate: { $lte: moment().endOf("days").format() },
            isCanceled: false,
            isDeleted: false
        }).populate([{
            path: "sessions",
            populate: [{ path: "vehicleCategory", match: { isDeleted: false } }, { path: "vehicleTypeId", match: { isDeleted: false } }],
            match: { isDeleted: false }
        }, { path: "name" }]).sort({ fromDate: -1 }).then((result) => {
            let sessionsTimes = []

            result.map((items) => {
                items.sessions.map((item) => {
                    let startTime = moment(moment().format('YYYY-MM-DD') + ' ' + item.fromTime).format()
                    let endTime = moment(moment().format('YYYY-MM-DD') + ' ' + item.toTime).format()
                    if (moment().isSameOrAfter(startTime) && moment().isSameOrBefore(endTime)) {
                        let findIndex = sessionsTimes.findIndex((element) => element._id == items._id)

                        if (findIndex >= 0) {
                            sessionsTimes[findIndex].sessions.push(item)
                        } else {
                            sessionsTimes.push({ ...items._doc, sessions: [item] })
                        }
                    }
                })
            })

            if (sessionsTimes.length > 0) {
                res.status(200).json({ message: CommonMessage.getEvent.success, success: true, data: sessionsTimes })
            } else {
                res.status(200).json({ message: CommonMessage.getEvent.noEvent, success: false })
            }

        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEvent.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getCurrentEventUser = async (req, res) => {
    try {

        EventModel.find({
            $expr: {
                $eq: [
                    { $dateToString: { format: '%Y-%m-%d', date: '$$NOW' } },
                    { $dateToString: { format: '%Y-%m-%d', date: '$fromDate' } },
                ],
            },
            toDate: { $lte: moment().endOf("days").format() },
            isCanceled: false,
            isDeleted: false
        }).populate([{
            path: "sessions",
            populate: [{ path: "vehicleCategory", match: { isDeleted: false } }, { path: "vehicleTypeId", match: { isDeleted: false } }],
            match: { isDeleted: false }
        }, { path: "name" }, { path: "organizer", select: "name email phoneNumber countryCode image location" },]).sort({ fromDate: -1 }).then((result) => {
            let sessionstimes = []

            result.map((items) => {
                items.sessions.map((item) => {
                    let startTime = moment(moment().format('YYYY-MM-DD') + ' ' + item.fromTime).format()
                    let endTime = moment(moment().format('YYYY-MM-DD') + ' ' + item.toTime).format()
                    if (moment().isSameOrAfter(startTime) && moment().isSameOrBefore(endTime)) {
                        let findIndexs = sessionstimes.findIndex((element) => element._id == items._id)

                        if (findIndexs >= 0) {
                            sessionstimes[findIndexs].sessions.push(item)
                        } else {
                            sessionstimes.push({ ...items._doc, sessions: [item] })
                        }
                    }
                })
            })

            if (sessionstimes.length > 0) {
                res.status(200).json({ message: CommonMessage.getEvent.success, success: true, data: sessionstimes })
            } else {
                res.status(200).json({ message: CommonMessage.getEvent.noEvent, success: false })
            }

        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEvent.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.bookEvent = async (req, res) => {
    try {
        const { userdetails } = req
        const { event, sessionDetails } = req.body

        validateBookingRequest(event, sessionDetails, userdetails).then(async (vehicleCategoriesArray) => {

            let insertDetails = []

            let insertObject = await sessionDetails.map((items) => (
                items.vehicleDetails.map((element) => (
                    insertDetails.push({
                        user: userdetails._id,
                        event: event,
                        session: items.session,
                        vehicleCategory: element.vehicleCategoryId,
                        vehiclesBooked: element.selectedVehicles
                    })
                ))
            ))


            await Promise.all(insertObject).then(() => {
                BookedModel.insertMany(insertDetails).then(() => {
                    VehicleCategoryModel.updateMany({ _id: { $in: vehicleCategoriesArray } }, { $inc: { bookedSlots: 1 } }).then(() => {
                        res.status(200).json({ message: CommonMessage.bookEvent.success, success: true })
                    })
                }).catch((error) => {
                    res.status(400).json({ message: CommonMessage.bookEvent.failed, success: false, error: error.toString() })
                })
            })

        }).catch((error) => {
            res.status(400).json(error)
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getAllBookings = async (req, res) => {
    try {
        const { userdetails } = req

        const paginationObject = pagination(req.query.limit || 10, req.query.page || 1, await BookedModel.countDocuments({ user: userdetails._id, isDeleted: false }))

        BookedModel.find({ user: userdetails._id, isDeleted: false }).populate([
            {
                path: "event", match: { isDeleted: false },
                populate: {
                    path: "name"
                },
            },
            {
                path: "session", match: { isDeleted: false },
            },
            {
                path: "vehicleCategory", match: { isDeleted: false },
            },
            {
                path: "vehiclesBooked.vehicleId", match: { isDeleted: false },
            }
        ]).limit(paginationObject.limit).skip(paginationObject.skip).then((details) => {
            res.status(200).json({ message: CommonMessage.getAllBookings.success, success: true, data: details, pagination: paginationObject })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getAllBookings.failed, success: false, error: error.stack })
        })


    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getSingleBookings = async (req, res) => {
    try {
        const { userdetails } = req
        const { booking_id } = req.params

        BookedModel.findOne({ user: userdetails._id, isDeleted: false, _id: booking_id }).populate([
            {
                path: "event", match: { isDeleted: false },
                populate: {
                    path: "name"
                }
            },
            {
                path: "session", match: { isDeleted: false },
            },
            {
                path: "vehicleCategory", match: { isDeleted: false },
            },
            {
                path: "vehiclesBooked.vehicleId", match: { isDeleted: false },
            },
        ]).then((details) => {
            if (!details) {
                return res.status(400).json({ message: CommonMessage.getSingleBookings.notfound, success: false })
            }

            details._doc.vehicleCategory.bookings = [{ vehiclesBooked: details._doc.vehiclesBooked }]
            delete details._doc.vehiclesBooked

            details._doc.session.vehicleCategory = [details._doc.vehicleCategory]
            delete details._doc.vehicleCategory

            details._doc.event.sessions = [details._doc.session]
            delete details._doc.session

            res.status(200).json({ message: CommonMessage.getSingleBookings.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getSingleBookings.failed, success: false, error: error.stack })
        })


    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}