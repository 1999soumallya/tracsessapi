const CommonMessage = require("../helpers/CommonMessage");
const { pagination } = require("../helpers/Helpers");
const BookedModel = require("../models/BookedModel");
const RidersModel = require("../models/RidersModel");
const SessionModel = require("../models/SessionModel");
const VehiclesModel = require("../models/VehiclesModel");

exports.addVehicle = async (req, res) => {
    try {
        const { userdetails, usertype } = req
        let { vehicles } = req.body

        vehicles = await vehicles.map((items) => ({ ...items, [usertype]: userdetails._id, vehicleSource: (usertype == "user") ? 'OWN' : 'ORG', vehicleType: items.vehicleTypeId }))

        VehiclesModel.insertMany(vehicles).then((details) => {
            res.status(201).json({ message: CommonMessage.addVehicle.success, success: true, data: details })
        }).catch((error) => {
            res.status(409).json({ message: CommonMessage.addVehicle.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.updateVehicle = async (req, res) => {
    try {
        const { userdetails } = req
        const { id } = req.params
        const { CC, vehicleTypeId, name, nickname, registrationNumber, racingNumber, chassisNumber, engineNumber } = req.body

        VehiclesModel.findOneAndUpdate({ $or: [{ user: userdetails._id }, { organizer: userdetails._id },], _id: id, isDeleted: false }, { CC, vehicleType: vehicleTypeId, name, nickname, registrationNumber, racingNumber, chassisNumber, engineNumber }, { new: true }).populate("vehicleType").then((details) => {
            res.status(202).json({ message: details ? CommonMessage.updateVehicle.success : CommonMessage.updateVehicle.novehicle, success: details ? true : false, data: details })
        }).catch((error) => {
            res.status(409).json({ message: CommonMessage.updateVehicle.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deleteVehicle = async (req, res) => {
    try {
        const { userdetails, usertype } = req
        let { id } = req.query

        if (typeof id == "string") {
            id = JSON.parse(id)
        }

        // await BookedModel.find({ "vehiclesBooked.vehicleId": { $in: id } })

        VehiclesModel.updateMany({ [usertype]: userdetails._id, _id: { $in: id }, isDeleted: false }, { isDeleted: true }, { new: true }).then((details) => {
            res.status(200).json({ message: details ? CommonMessage.deleteVehicle.success : CommonMessage.deleteVehicle.novehicle, success: details ? true : false })
        }).catch((error) => {
            res.status(409).json({ message: CommonMessage.deleteVehicle.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deleteAllVehicle = async (req, res) => {
    try {
        const { userdetails, usertype } = req

        VehiclesModel.updateMany({ [usertype]: userdetails._id, isDeleted: false }, { isDeleted: true }).then(() => {
            res.status(200).json({ message: CommonMessage.deleteVehicle.success, success: true })
        }).catch((error) => {
            res.status(409).json({ message: CommonMessage.deleteVehicle.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.toggleVehicle = async (req, res) => {
    try {
        const { userdetails } = req
        const { id } = req.params

        const vehicleDetails = await VehiclesModel.findOne({ $or: [{ user: userdetails._id }, { organizer: userdetails._id },], _id: id, isDeleted: false })

        if (!vehicleDetails) {
            return res.status(200).json({ message: CommonMessage.deleteVehicle.novehicle, success: false })
        }

        VehiclesModel.findOneAndUpdate({ $or: [{ user: userdetails._id }, { organizer: userdetails._id },], _id: id, isDeleted: false }, { isActive: !vehicleDetails.isActive }, { new: true }).then((result) => {
            res.status(202).json({ message: result.isActive ? CommonMessage.toggleVehicle.active : CommonMessage.toggleVehicle.deactive, success: true })
        }).catch((error) => {
            res.status(409).json({ message: CommonMessage.toggleVehicle.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getAllVehicleWeb = async (req, res) => {
    try {
        const { userdetails } = req
        let total = await VehiclesModel.countDocuments({ $or: [{ user: userdetails._id }, { organizer: userdetails._id }], isDeleted: false })
        let paginationObject = pagination(req.query.limit ? req.query.limit : 10, req.query.page ? req.query.page : 1, total)

        VehiclesModel.find({ $or: [{ user: userdetails._id }, { organizer: userdetails._id }], isDeleted: false }).skip(paginationObject.skip).limit(paginationObject.limit).populate("vehicleType").then((result) => {
            res.status(200).json({ message: result.length > 0 ? CommonMessage.getVehicle.success : CommonMessage.getVehicle.noVehicle, success: true, data: result, pagination: paginationObject })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getVehicle.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getAllVehicleMobile = async (req, res) => {
    try {
        const { userdetails } = req

        VehiclesModel.find({ $or: [{ user: userdetails._id }, { organizer: userdetails._id }], isDeleted: false }).populate("vehicleType").then((result) => {
            res.status(200).json({ message: result.length > 0 ? CommonMessage.getVehicle.success : CommonMessage.getVehicle.noVehicle, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getVehicle.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getSingleVehicle = async (req, res) => {
    try {
        const { userdetails } = req
        const { vehicle_id } = req.params

        VehiclesModel.findOne({ $or: [{ user: userdetails._id }, { organizer: userdetails._id }], _id: vehicle_id, isDeleted: false }).populate("vehicleType").then((result) => {
            res.status(200).json({ message: result ? CommonMessage.getSingleVehicle.success : CommonMessage.getSingleVehicle.noVehicle, success: result ? true : false, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getSingleVehicle.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}


exports.getUserVehicle = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { riderId, sessionId } = req.body

        SessionModel.findOne({ _id: sessionId }).then((sessionDetails) => {
            if (!sessionDetails) {
                return res.status(400).json({ message: CommonMessage.getRiderVehicle.noSession, success: false })
            }

            RidersModel.findOne({ creator: tunersDetails._id, event: sessionDetails.event, status: "accepted", rider: riderId }).populate('rider').then((details) => {
                if (!details) {
                    return res.status(400).json({ message: CommonMessage.getRiderVehicle.notAvailable, success: false })
                }
    
                if (!details.rider) {
                    return res.status(400).json({ message: CommonMessage.getRiderVehicle.noRider, success: false })
                }
    
                VehiclesModel.find({ user: details.rider._id, vehicleType: sessionDetails.vehicleTypeId }).then((vehicles) => {
                    res.status(200).json({ message: CommonMessage.getRiderVehicle.success, success: true, data: vehicles })
                }).catch((error) => {
                    res.status(400).json({ message: CommonMessage.getRiderVehicle.failed, success: false, error: error.toString() })
                })
            }).catch((error) => {
                res.status(400).json({ message: CommonMessage.getRiderVehicle.failed, success: false, error: error.toString() })
            })

        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getRiderVehicle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}