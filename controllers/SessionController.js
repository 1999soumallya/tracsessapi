const CommonMessage = require("../helpers/CommonMessage");
const EventModel = require("../models/EventModel");
const SessionModel = require("../models/SessionModel");
const VehicleCategoryModel = require("../models/VehicleCategoryModel");

exports.addsession = async (req, res) => {
    try {
        const { organizerdetails } = req
        const { event, name, fromTime, toTime, vehicleTypeId, sameAsSession, vehicleCategories } = req.body

        let session = await SessionModel.create({ name, fromTime, toTime, vehicleTypeId, sameAsSession })

        EventModel.findOneAndUpdate({ _id: event, organizer: organizerdetails._id }, { $push: { sessions: session._id } }, { new: true }).then((eventdetails) => {
            if (!eventdetails) {
                SessionModel.deleteOne({ _id: session._id }).then(() => {
                    return res.status(400).json({ message: CommonMessage.addSession.eventnotfound, success: false })
                })
            } else {
                if (vehicleCategories && (vehicleCategories.length > 0)) {
                    VehicleCategoryModel.insertMany(vehicleCategories).then(async (result) => {
                        let vehicleCategory = await result.map((items) => (items._id))
                        SessionModel.findByIdAndUpdate(session._id, { vehicleCategory }, { new: true }).populate([{ path: "vehicleCategory" }, { path: "events" }]).then((details) => {
                            res.status(201).json({ message: CommonMessage.addSession.success, success: true, session: details })
                        })
                    })
                } else {
                    res.status(201).json({ message: CommonMessage.addSession.success, success: true, session })
                }
            }
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.updatesession = async (req, res) => {
    try {
        const { id } = req.params
        const { name, fromTime, toTime, vehicleTypeId, sameAsSession } = req.body

        SessionModel.findOneAndUpdate({ _id: id, isDeleted: false }, { name, fromTime, toTime, vehicleTypeId, sameAsSession }, { new: true }).populate([{ path: "vehicleCategory" }, { path: "events" }]).then((details) => {
            res.status(200).json({ message: details ? CommonMessage.updateSession.success : CommonMessage.updateSession.notfound, success: details ? true : false, data: details })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.updateSession.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deletesession = async (req, res) => {
    try {
        const { id } = req.params

        SessionModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true }).populate("events").then((details) => {
            VehicleCategoryModel.updateMany({ _id: { $in: details.vehicleCategory }, isDeleted: false }, { isDeleted: true }).then(() => {
                res.status(200).json({ message: details ? CommonMessage.deleteSession.success : CommonMessage.deleteSession.notfound, success: details ? true : false, data: details })
            })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.deleteSession.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deleteMultipleSession = async (req, res) => {
    try {
        const { ids } = req.body

        const sessionDetails = await SessionModel.find({ _id: { $in: ids } })

        SessionModel.updateMany({ _id: { $in: ids }, isDeleted: false }, { isDeleted: true }, { multi: true }).populate("events").then((details) => {
            if (sessionDetails.length > 0) {
                VehicleCategoryModel.updateMany({ _id: { $in: sessionDetails.flatMap((item) => item.vehicleCategory) }, isDeleted: false }, { isDeleted: true }).then(() => {
                    res.status(200).json({ message: CommonMessage.deleteMultipleSession.success, success: true, data: details })
                })
            } else {
                res.status(200).json({ message: CommonMessage.deleteMultipleSession.success, success: true, data: details })
            }
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.deleteMultipleSession.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.togglesession = async (req, res) => {
    try {
        const { id } = req.params
        const sessiondetails = await SessionModel.findOne({ _id: id, isDeleted: false })

        if (!sessiondetails) {
            return res.status(400).json({ message: CommonMessage.toggleSession.notfound, success: false })
        }

        SessionModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isActive: !sessiondetails.isActive }, { new: true }).then((result) => {
            res.status(200).json({ message: result.isActive ? CommonMessage.toggleSession.active : CommonMessage.toggleSession.deactive, success: true })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.toggleSession.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getEventAllSession = async (req, res) => {
    try {
        const { organizerdetails } = req
        const { eventid } = req.params

        EventModel.findOne({ _id: eventid, organizer: organizerdetails._id, isDeleted: false }, { sessions: 1 }).populate({
            path: "sessions",
            populate: [{ path: "vehicleCategory", match: { isDeleted: false } }, { path: "vehicleTypeId", match: { isDeleted: false } }],
            match: { isDeleted: false }
        }).then((details) => {
            res.status(200).json({ message: CommonMessage.getSession.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getSession.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getSingleSession = async (req, res) => {
    try {
        const { session_id } = req.params

        SessionModel.findOne({ _id: session_id, isDeleted: false }).populate([{ path: "vehicleCategory", match: { isDeleted: false } }, { path: "vehicleTypeId", match: { isDeleted: false } }]).then((result) => {
            res.status(200).json({ message: result ? CommonMessage.getSession.success : CommonMessage.getSession.noSession, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getSession.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}