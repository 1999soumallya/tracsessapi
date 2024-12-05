const CommonMessage = require("../helpers/CommonMessage")
const VehicleTypeModel = require("../models/VehicleTypeModel")

exports.addVehicleType = async (req, res) => {
    try {

        const { type, name } = req.body

        VehicleTypeModel.create({ type, name }).then((result) => {
            res.status(200).json({ message: CommonMessage.addVehicleType.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.addVehicleType.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getAllVechileType = async (req, res) => {
    try {

        const search = req.query.search ? req.query.search : ""

        VehicleTypeModel.find({ isDeleted: false, type: { $regex: search, $options: "si" } }).then((result) => {
            res.status(200).json({ message: CommonMessage.getAllVehicleType.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getAllVehicleType.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deleteVechileType = async (req, res) => {
    try {
        const { vehicle_id } = req.params

        VehicleTypeModel.findOneAndUpdate({ _id: vehicle_id, isDeleted: false }, { isDeleted: true }).then(() => {
            res.status(200).json({ message: CommonMessage.deleteVehicleType.success, success: true })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.deleteVehicleType.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getSingleVechileType = async (req, res) => {
    try {
        const { vehicle_id } = req.params

        VehicleTypeModel.findOne({ _id: vehicle_id, isDeleted: false }).populate("vechiles").then((details) => {
            res.status(200).json({ message: CommonMessage.deleteVehicleType.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.deleteVehicleType.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.SearchVechileType = async (req, res) => {
    try {
        const { vehicle_id } = req.body

        let findObject = { isDeleted: false }

        if (vehicle_id.length > 0) {
            Object.assign(findObject, { _id: { $in: vehicle_id } })
        }

        VehicleTypeModel.find(findObject).populate("vechiles").then((details) => {
            res.status(200).json({ message: CommonMessage.deleteVehicleType.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.deleteVehicleType.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}