const CommonMessage = require("../helpers/CommonMessage");
const VehicleCategoryModel = require("../models/VehicleCategoryModel");

exports.addvehiclecategory = async (req, res) => {
    try {
        const { vehicleSource, fromCC, toCC, CC, slots, bookedSlots, amount, period } = req.body

        let insertobject = { vehicleSource, slots, bookedSlots, amount, period }

        if (fromCC && toCC) {
            Object.assign(insertobject, { fromCC: fromCC, toCC: toCC })
        }

        if (CC) {
            insertobject.CC = CC
        }

        VehicleCategoryModel.create(insertobject).then((details) => {
            res.status(200).json({ message: CommonMessage.addVehicleCategory.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.addVehicleCategory.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.updatevehiclecategory = async (req, res) => {
    try {
        const { id } = req.params
        const { vehicleSource, fromCC, toCC, CC, slots, bookedSlots, amount, period } = req.body

        VehicleCategoryModel.findByIdAndUpdate(id, { vehicleSource, fromCC, toCC, CC, slots, bookedSlots, amount, period }, { new: true }).then((details) => {
            res.status(200).json({ message: CommonMessage.updateVehicleCategory.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.updateVehicleCategory.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deletevehiclecategory = async (req, res) => {
    try {
        const { id } = req.params

        VehicleCategoryModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }).then(() => {
            res.status(200).json({ message: CommonMessage.deleteVehicleCategory.success, success: true })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.deleteVehicleCategory.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.togglevehiclecategory = async (req, res) => {
    try {
        const { id } = req.params

        const vehiclecategorydetails = await VehicleCategoryModel.findOne({ _id: id, isDeleted: false })

        VehicleCategoryModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isActive: !vehiclecategorydetails.isActive }, { new: true }).then((result) => {
            res.status(200).json({ message: result.isActive ? CommonMessage.toggleVehicleCategory.active : CommonMessage.toggleVehicleCategory.deactive, success: true })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.toggleVehicleCategory.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}