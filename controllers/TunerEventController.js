const CommonMessage = require("../helpers/CommonMessage")
const { pagination, uploadFileS3Client } = require("../helpers/Helpers")
const EventNameModel = require("../models/EventNameModel")
const ImageGallery = require("../models/ImageGallery")
const SessionModel = require("../models/SessionModel")
const TunersEventModel = require("../models/TunersEventModel")
const UUID = require('uuid')
const moment = require('moment-timezone')
const RidersModel = require('../models/RidersModel')
const VehicleTypeModel = require("../models/VehicleTypeModel")
const CrewMembersModel = require("../models/CrewMembersModel")

exports.addEvent = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { eventName, fromDate, toDate, track } = req.body
        let eventDetails = req.body.eventSchedule
        let fileName, imagePatch, createEventArray = []

        let nameDetails = await EventNameModel.findOne({ alias: eventName.replaceAll(/\s/g, '').toLowerCase(), tuner: tunersDetails._id, isDeleted: false })

        if (!nameDetails) {
            nameDetails = await EventNameModel.create({ name: eventName, tuner: tunersDetails._id })
        }

        if (req.file) {
            fileName = UUID.v4()
            imagePatch = await (await uploadFileS3Client(req.file, fileName, 'tunerEventImages')).location
        }

        let createObject = { image: imagePatch, name: nameDetails._id, track, tuner: tunersDetails._id, fromDate: moment(fromDate, 'DD-MM-YYYY HH:mm:ss').utc().format(), toDate: moment(toDate, 'DD-MM-YYYY HH:mm:ss').utc().format() }

        TunersEventModel.create(createObject).then(async (result) => {
            if (req.file) {
                await ImageGallery.create({ event: result._id, imagePatch, fileName })
            }

            if (eventDetails && eventDetails.length > 0) {
                let sessionStartTimes = []
                let sessionEndTimes = []

                await eventDetails.map((items) => {
                    if (items.sessions && items.sessions.length > 0) {
                        items.sessions.forEach(element => {
                            sessionStartTimes.push(moment(element.fromTime))
                            sessionEndTimes.push(moment(element.toTime))
                            createEventArray.push({ event: result._id, name: element.name, fromTime: element.fromTime, toTime: element.toTime, vehicleTypeId: element.vehicleTypeId })
                        });
                    }
                })

                SessionModel.insertMany(createEventArray).then(() => {
                    result.fromDate = moment.min(sessionStartTimes);
                    result.toDate = moment.max(sessionEndTimes)
                    result.save()
                    res.status(201).json({ message: CommonMessage.addEvent.success(nameDetails.name), success: true })
                }).catch((error) => {
                    res.status(400).json({ message: CommonMessage.addEvent.failed, success: false, error: error.toString() })
                })
            } else {
                res.status(201).json({ message: CommonMessage.addEvent.success, success: true })
            }
        }).catch((error) => {
            console.log(error)
            res.status(400).json({ message: CommonMessage.addEvent.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.updateEvent = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { eventId } = req.params
        const { eventName, fromDate, toDate, track, eventSchedule } = req.body
        let fileName, imagePatch, nameDetails

        let updateObject = { track }

        if (eventName) {
            nameDetails = await EventNameModel.findOne({ alias: eventName.replaceAll(/\s/g, '').toLowerCase(), tuner: tunersDetails._id })

            if (!nameDetails) {
                nameDetails = await EventNameModel.create({ name: eventName, tuner: tunersDetails._id })
            }

            updateObject.name = nameDetails._id
        }

        if (req.file) {
            fileName = UUID.v4()
            imagePatch = await (await uploadFileS3Client(req.file, fileName, 'tunerEventImages')).location
            await ImageGallery.create({ event: eventId, imagePatch, fileName })
            updateObject.image = imagePatch
        }

        if (fromDate) {
            Object.assign(updateObject, { fromDate: moment(fromDate, 'DD-MM-YYYY HH:mm:ss').utc().format() })
        }

        if (toDate) {
            Object.assign(updateObject, { toDate: moment(toDate, 'DD-MM-YYYY HH:mm:ss').utc().format() })
        }

        TunersEventModel.findOneAndUpdate({ _id: eventId, tuner: tunersDetails._id }, updateObject, { new: true }).populate('name').then(async (details) => {

            if (eventSchedule && eventSchedule.length > 0) {
                for (let index = 0; index < eventSchedule.length; index++) {
                    const sessionDetails = eventSchedule[index];

                    if (sessionDetails.sessions && sessionDetails.sessions.length > 0) {
                        for (let j = 0; j < sessionDetails.sessions.length; j++) {
                            const sessions = sessionDetails.sessions[j];
                            if (sessions._id) {
                                let update_object = {}

                                if (sessions.name) {
                                    Object.assign(update_object, { name: sessions.name })
                                }

                                if (sessions.fromTime) {
                                    Object.assign(update_object, { fromTime: sessions.fromTime })
                                }

                                if (sessions.toTime) {
                                    Object.assign(update_object, { toTime: sessions.toTime })
                                }

                                if (sessions.vehicleTypeId) {
                                    Object.assign(update_object, { vehicleTypeId: sessions?.vehicleTypeId })
                                }

                                await SessionModel.findOneAndUpdate({ _id: sessions._id, event: details._id }, update_object, { new: true })

                            } else {
                                if (await SessionModel.findOne({ name: sessions.name, fromTime: sessions.fromTime, toTime: sessions.toTime })) {
                                    return res.status(200).json({ message: CommonMessage.updateEvent.update_sessions, success: false })
                                }
                                await SessionModel.create({ event: details._id, name: sessions.name, fromTime: sessions.fromTime, toTime: sessions.toTime, vehicleTypeId: sessions.vehicleTypeId })
                            }
                        }
                    }
                }

                const nearest_session_details = await SessionModel.findOne({ event: details._id }).sort({ fromTime: 1 })
                const longest_session_details = await SessionModel.findOne({ event: details._id }).sort({ toTime: -1 })

                await CrewMembersModel.updateMany({ eventId: details._id }, { expire: longest_session_details.toTime })
                await RidersModel.updateMany({ event: details._id }, { expire: longest_session_details.toTime })

                details.fromDate = nearest_session_details.fromTime;
                details.toDate = longest_session_details.toTime
                details.save()
            }

            res.status(200).json({ message: CommonMessage.updateEvent.success(details.name.name), success: true })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.updateEvent.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deleteEvent = async (req, res) => {
    try {

        const { id } = req.params
        const { tunersDetails } = req

        if (!await TunersEventModel.findOne({ _id: id, tuner: tunersDetails._id })) {
            return res.status(200).json({ message: CommonMessage.deleteEvent.eventnotfound, success: false })
        }

        TunersEventModel.findOneAndUpdate({ _id: id, tuner: tunersDetails._id }, { isDeleted: true }).populate([{ path: "sessions" }, { path: "name" }]).then(async (details) => {
            let sessionid = await details.sessions.map((items) => (items._id))
            SessionModel.updateMany({ _id: { $in: sessionid } }, { isDeleted: true }).then(() => {
                res.status(200).json({ message: CommonMessage.deleteEvent.success(details.name.name), success: true })
            })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.deleteEvent.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deleteEvents = async (req, res) => {
    try {
        const { tunersDetails } = req

        let events = await TunersEventModel.find({ tuner: tunersDetails._id }).populate("sessions")

        let sessions = []

        events.map((items) => {
            items.sessions.map((item) => {
                sessions.push(item._id)
            })
        })

        SessionModel.updateMany({ _id: { $in: sessions } }, { isDeleted: true }).then(() => {
            TunersEventModel.updateMany({ tuner: tunersDetails._id }, { isDeleted: true }).then(() => {
                res.status(200).json({ message: CommonMessage.deleteEvent.success(''), success: true })
            })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.deleteEvent.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(400).json(CommonMessage.commonError(error))
    }
}

exports.toggleEvent = async (req, res) => {
    try {
        const { id } = req.params
        const { tunersDetails } = req

        const eventDetails = await TunersEventModel.findOne({ _id: id, tuner: tunersDetails._id })

        if (!eventDetails) {
            return res.status(200).json({ message: CommonMessage.toggleEvent.eventnotfound, success: false })
        }

        TunersEventModel.findOneAndUpdate({ _id: id, tuner: tunersDetails._id }, { isActive: !eventDetails.isActive }, { new: true }).populate({ path: "sessions" }).then(async (result) => {
            let sessionid = await result.sessions.map((items) => (items._id))

            SessionModel.updateMany({ _id: { $in: sessionid }, isDeleted: false }, { isActive: !eventDetails.isActive }).then(() => {
                res.status(200).json({ message: result.isActive ? CommonMessage.toggleEvent.active : CommonMessage.toggleEvent.deactive, success: true })
            })

        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.toggleEvent.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.cancelEvent = async (req, res) => {
    try {
        const { id } = req.params
        const { tunersDetails } = req

        const eventDetails = await TunersEventModel.findOne({ _id: id, tuner: tunersDetails._id })

        if (!eventDetails) {
            return res.status(200).json({ message: CommonMessage.cancleEvent.eventnotfound, success: false })
        }

        if (eventDetails.isCanceled) {
            return res.status(200).json({ message: CommonMessage.cancleEvent.already, success: false })
        }

        TunersEventModel.findOneAndUpdate({ _id: id, tuner: tunersDetails._id }, { isCanceled: true }, { new: true }).populate({ path: "sessions" }).then(async (result) => {
            let sessionid = await result.sessions.map((items) => (items._id))

            SessionModel.updateMany({ _id: { $in: sessionid }, isDeleted: false }, { isCanceled: result.isCanceled }).then(() => {
                BookedModel.updateMany({ event: result._id }, { isCanceled: true }).then(() => {
                    res.status(200).json({ message: CommonMessage.cancleEvent.success, success: true })
                })
            })

        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.cancleEvent.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getAllTunerEvent = async (req, res) => {
    try {

        const { tunersDetails } = req

        let paginationDetails = pagination(req.query.limit ? req.query.limit : 10, req.query.page ? req.query.page : 1, await TunersEventModel.countDocuments({ tuner: tunersDetails._id }))

        TunersEventModel.find({ tuner: tunersDetails._id }).sort({ createdAt: -1 }).populate([
            { path: "name" },
            { path: 'track', select: '-createdAt -updatedAt -isDeleted -__v' }
        ]).skip(paginationDetails.skip).limit(paginationDetails.limit).then((result) => {
            res.status(200).json({ message: (result.length > 0) ? CommonMessage.getEvent.success : CommonMessage.getEvent.noEvent, success: (result.length > 0) ? true : false, data: result, pagination: paginationDetails })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEvent.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getUserTunerEvent = async (req, res) => {
    try {
        const { userdetails } = req

        const riderDetails = await RidersModel.find({ rider: userdetails._id, status: 'accepted' }, { event: 1 })
        let events = []

        if (riderDetails.length > 0) {
            events = riderDetails.map((riderDetails) => riderDetails.event)
        }

        let paginationDetails = pagination(req.query.limit ? req.query.limit : 10, req.query.page ? req.query.page : 1, await TunersEventModel.countDocuments({ _id: { $in: events }, fromDate: { $gte: moment().startOf("day").format() } }))

        TunersEventModel.find({ _id: { $in: events }, fromDate: { $gte: moment().startOf("day").format() } }, { createdAt: 0, updatedAt: 0, isDeleted: 0, __v: 0 }).populate([
            { path: "name", select: "-createdAt -updatedAt -isDeleted -__v" },
            { path: 'track', select: '-createdAt -updatedAt -isDeleted -__v' },
            { path: 'sessions', select: '-createdAt -updatedAt -isDeleted -__v' }
        ]).sort({ fromDate: -1 }).skip(paginationDetails.skip).limit(paginationDetails.limit).then((result) => {
            res.status(200).json({ message: (result.length > 0) ? CommonMessage.getEvent.success : CommonMessage.getEvent.noEvent, success: true, data: result, pagination: paginationDetails })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEvent.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getSingleTunerEvent = async (req, res) => {
    try {

        const { userdetails } = req
        const { event_id } = req.params

        const rider_details = await RidersModel.findOne({ rider: userdetails._id, status: 'accepted', event: event_id }, { event: 1 }).populate({
            path: "event",
            match: {
                fromDate: {
                    $gte: moment().startOf("day").format()
                }
            },
            populate: [
                { path: "name", select: "-createdAt -updatedAt -isDeleted -__v" },
                { path: 'track', select: '-createdAt -updatedAt -isDeleted -__v' }
            ],
            select: "-createdAt -updatedAt -isDeleted -__v"
        })

        if (!rider_details) {
            return res.status(200).json({ message: CommonMessage.singleEvent.noEvent, success: false })
        }

        if (!rider_details.event) {
            return res.status(200).json({ message: CommonMessage.singleEvent.noEvent, success: false })
        }

        SessionModel.aggregate([
            { $match: { event: rider_details.event._id } },
            { $sort: { fromTime: 1 } },
            { $project: { fromTime: 1, name: 1, toTime: 1, vehicleTypeId: 1 } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d", date: "$fromTime"
                        }
                    },
                    sessions: {
                        $push: {
                            _id: "$_id",
                            name: "$name",
                            fromTime: "$fromTime",
                            toTime: "$toTime",
                            vehicleType: "$vehicleTypeId"
                        }
                    }
                }
            },
            { $sort: { _id: 1 } },
            {
                $addFields: {
                    date: { $arrayElemAt: [{ $map: { input: "$sessions", as: "session", in: "$$session.fromTime" } }, 0] }
                }
            },
            {
                $project: {
                    date: 1,
                    sessions: 1,
                    _id: 0
                }
            },
        ]).then(async (result) => {
            result = await VehicleTypeModel.populate(result, { path: 'sessions.vehicleType', select: { createdAt: 0, updatedAt: 0, __v: 0 } })
            res.status(200).json({ message: CommonMessage.singleEvent.success, success: true, data: { ...rider_details.event._doc, eventSchedule: result } })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEvent.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getEvent = async (req, res) => {
    try {

        const { tunersDetails } = req
        const { event_id } = req.params

        const eventDetails = await TunersEventModel.findOne({ _id: event_id, tuner: tunersDetails._id }, { createdAt: 0, updatedAt: 0, __v: 0 }).populate([
            { path: "name" },
            { path: 'track', select: '-createdAt -updatedAt -isDeleted -__v' }
        ])

        if (!eventDetails) {
            return res.status(200).json({ message: CommonMessage.singleEvent.noEvent, success: false })
        }

        SessionModel.aggregate([
            { $match: { event: eventDetails._id } },
            { $sort: { fromTime: 1 } },
            { $project: { fromTime: 1, name: 1, toTime: 1, vehicleTypeId: 1 } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d", date: "$fromTime"
                        }
                    },
                    sessions: {
                        $push: {
                            _id: "$_id",
                            name: "$name",
                            fromTime: "$fromTime",
                            toTime: "$toTime",
                            vehicleType: "$vehicleTypeId"
                        }
                    }
                }
            },
            { $sort: { _id: 1 } },
            {
                $addFields: {
                    date: { $arrayElemAt: [{ $map: { input: "$sessions", as: "session", in: "$$session.fromTime" } }, 0] }
                }
            },
            {
                $project: {
                    date: 1,
                    sessions: 1,
                    _id: 0
                }
            },
        ]).then(async (result) => {
            result = await VehicleTypeModel.populate(result, { path: 'sessions.vehicleType' })
            res.status(200).json({ message: CommonMessage.singleEvent.success, success: true, data: { ...eventDetails._doc, eventSchedule: result } })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEvent.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getAllTunerEventName = async (req, res) => {
    try {

        const { tunersDetails } = req
        const search = req.query.search ? req.query.search : ""

        let paginationDetails = pagination(req.query.limit ? req.query.limit : 10, req.query.page ? req.query.page : 1, await EventNameModel.countDocuments({ name: { $regex: search, $options: "si" }, tuner: tunersDetails._id, isDeleted: false }))

        EventNameModel.find({ name: { $regex: search, $options: "si" }, tuner: tunersDetails._id, isDeleted: false }).skip(paginationDetails.skip).limit(paginationDetails.limit).then((result) => {
            res.status(200).json({ message: (result.length > 0) ? CommonMessage.getEventName.success : CommonMessage.getEventName.noEvent, success: (result.length > 0) ? true : false, data: result, pagination: paginationDetails })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEventName.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deleteTunerEventName = async (req, res) => {
    try {

        const { tunersDetails } = req
        const { event_name_id } = req.params

        EventNameModel.findOneAndUpdate({ isDeleted: false, _id: event_name_id, tuner: tunersDetails._id }, { isDeleted: true }, { new: true }).then((details) => {
            res.status(200).json({ message: details ? CommonMessage.deleteSingleName.success : CommonMessage.deleteSingleName.noEvent, success: details ? true : false, data: details })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.deleteSingleName.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deleteAllTunerEventName = async (req, res) => {
    try {
        const { tunersDetails } = req

        EventNameModel.updateMany({ isDeleted: false, tuner: tunersDetails._id }, { isDeleted: true }, { new: true }).then((details) => {
            res.status(200).json({ message: (details.matchedCount > 0) ? CommonMessage.deleteEventName.success : CommonMessage.deleteEventName.noEvent, success: details ? true : false, data: details })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.deleteEventName.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getCurrentTunerEvent = async (req, res) => {
    try {
        const { tunersDetails } = req

        TunersEventModel.find({
            tuner: tunersDetails._id,
            fromDate: {
                $lte: moment().utc().format()
            },
            toDate: {
                $gte: moment().utc().format()
            },
            isCanceled: false
        }, { createdAt: 0, updatedAt: 0, __v: 0, tuner: 0 }).populate([
            {
                path: "sessions",
                match: {
                    isDeleted: false,
                    fromTime: {
                        $lte: moment().utc().format()
                    },
                    toTime: {
                        $gte: moment().utc().format()
                    },
                    isCanceled: false
                },
                populate: {
                    path: 'setups',
                    select: 'name',
                    options: {
                        sort: { updatedAt: -1 },
                        limit: 1,
                    },
                    justOne: true,
                },
                select: '-createdAt -updatedAt -__v -isDeleted'
            },
            {
                path: "name",
                select: '-createdAt -updatedAt -__v -alias -isDeleted -tuner'
            }
        ]).sort({ createdAt: -1 }).then((result) => {
            res.status(200).json({ message: CommonMessage.getEvent.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEvent.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getCurrentTunerEventUser = async (req, res) => {
    try {
        const { userdetails } = req

        const event_details = await RidersModel.find({ rider: userdetails._id, status: 'accepted' })

        const events = event_details.map((event) => (event.event))

        TunersEventModel.find({
            _id: { $in: events },
            fromDate: {
                $lte: moment().utc().format()
            },
            toDate: {
                $gte: moment().utc().format()
            },
            isCanceled: false
        }).populate([
            {
                path: "sessions",
                match: {
                    isDeleted: false,
                    fromTime: {
                        $lte: moment().utc().format()
                    },
                    toTime: {
                        $gte: moment().utc().format()
                    },
                    isCanceled: false
                },
                populate: {
                    path: 'setups',
                    select: 'name',
                    options: {
                        sort: { updatedAt: -1 },
                        limit: 1,
                    },
                    justOne: true,
                },
                select: '-createdAt -updatedAt -__v -isDeleted'
            },
            {
                path: "name"
            }
        ]).sort({ fromDate: -1 }).then((result) => {
            res.status(200).json({ message: CommonMessage.getEvent.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEvent.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}


exports.getSingleCurrentTunerEvent = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { event_id } = req.params

        TunersEventModel.findOne({
            _id: event_id,
            tuner: tunersDetails._id,
            fromDate: {
                $lte: moment().utc().format()
            },
            toDate: {
                $gte: moment().utc().format()
            },
            isCanceled: false
        }, { createdAt: 0, updatedAt: 0, __v: 0, tuner: 0 }).populate([
            {
                path: "sessions",
                match: {
                    isDeleted: false,
                    fromTime: {
                        $lte: moment().utc().format()
                    },
                    toTime: {
                        $gte: moment().utc().format()
                    },
                    isCanceled: false
                },
                select: '-createdAt -updatedAt -__v -isDeleted'
            },
            {
                path: "name",
                select: '-createdAt -updatedAt -__v -alias -isDeleted -tuner'
            }
        ]).then((result) => {
            if (!result) {
                return res.status(200).json({ message: CommonMessage.singleEvent.noEvent, success: false })
            }
            let sessions = result.sessions

            let sessionArray = []

            if (sessions.length > 0) {
                sessions.map((element) => {
                    let findObject = sessionArray.find((session) => session?.date == moment(element?.fromTime).format('YYYY-MM-DD'))

                    if (findObject) {
                        let details = findObject.sessions.find((details) => details?._id == element?._id)

                        if (!details) {
                            findObject.sessions.push({
                                _id: element?._id,
                                name: element?.name,
                                fromTime: element?.fromTime,
                                toTime: element?.toTime,
                                vehicleType: element?.vehicleTypeId
                            })
                        }

                    } else {
                        sessionArray.push({
                            date: element?.fromTime,
                            sessions: [
                                {
                                    _id: element?._id,
                                    name: element?.name,
                                    fromTime: element?.fromTime,
                                    toTime: element?.toTime,
                                    vehicleType: element?.vehicleTypeId
                                }
                            ]
                        })
                    }
                })
                Object.assign(result._doc, { eventSchedule: sessionArray })
            }
            delete result._doc.sessions

            result._doc.eventSchedule.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });

            res.status(200).json({ message: CommonMessage.singleEvent.success, success: true, data: result._doc })

        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEvent.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getSingleCurrentTunerEventUser = async (req, res) => {
    try {

        const { userdetails } = req
        const { event_id } = req.params

        await RidersModel.findOne({ rider: userdetails._id, status: 'accepted', event: event_id }, { event: 1 }).populate({
            path: "event",
            match: {
                fromDate: {
                    $lte: moment().utc().format()
                },
                toDate: {
                    $gte: moment().utc().format()
                },
                isCanceled: false
            },
            populate: [
                {
                    path: "sessions",
                    populate: {
                        path: "vehicleTypeId",
                        select: "-createdAt -updatedAt -isDeleted -__v"
                    },
                    match: {
                        isDeleted: false,
                        fromTime: {
                            $lte: moment().utc().format()
                        },
                        toTime: {
                            $gte: moment().utc().format()
                        },
                        isCanceled: false
                    },
                    select: '-vehicleCategory -createdAt -updatedAt -isDeleted -__v',
                    sort: { fromTime: -1 }
                },
                { path: "name", select: "-createdAt -updatedAt -isDeleted -__v" },
                { path: 'track', select: '-createdAt -updatedAt -isDeleted -__v' }
            ],
            select: "-createdAt -updatedAt -isDeleted -__v"
        }).then((result) => {
            if (!result) {
                return res.status(200).json({ message: CommonMessage.singleEvent.noEvent, success: false })
            }

            if (!result.event) {
                return res.status(200).json({ message: CommonMessage.singleEvent.noEvent, success: false })
            }

            result = result.event

            let sessions = result.sessions

            let sessionArray = []

            if (sessions.length > 0) {
                sessions.map((element) => {
                    let findObject = sessionArray.find((session) => session?.date == moment(element?.fromTime).format('YYYY-MM-DD'))

                    if (findObject) {
                        let details = findObject.sessions.find((details) => details?._id == element?._id)

                        if (!details) {
                            findObject.sessions.push({
                                _id: element?._id,
                                name: element?.name,
                                fromTime: element?.fromTime,
                                toTime: element?.toTime,
                                vehicleType: element?.vehicleTypeId
                            })
                        }

                    } else {
                        sessionArray.push({
                            date: element?.fromTime,
                            sessions: [
                                {
                                    _id: element?._id,
                                    name: element?.name,
                                    fromTime: element?.fromTime,
                                    toTime: element?.toTime,
                                    vehicleType: element?.vehicleTypeId
                                }
                            ]
                        })
                    }
                })
                Object.assign(result._doc, { eventSchedule: sessionArray })
            }
            delete result._doc.sessions

            result._doc.eventSchedule.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });

            res.status(200).json({ message: CommonMessage.singleEvent.success, success: true, data: result._doc })

        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getEvent.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}