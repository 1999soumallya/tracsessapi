const CommonMessage = require("../helpers/CommonMessage")
const PeriodModel = require("../models/PeriodModel")

exports.addPeriod = (req, res) => {
    try {

        const { name, dependentfields } = req.body

        PeriodModel.create({ name, dependentfields }).then((details) => {
            res.status(200).json({ message: CommonMessage.addPeriod.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.addPeriod.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getAllPeriod = async (req, res) => {
    try {
        PeriodModel.find({ isDeleted: false, isActive: true }).then((result) => {
            res.status(200).json({ message: CommonMessage.getPeriod.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getPeriod.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.getSinglePeriod = async (req, res) => {
    try {
        const { id } = req.params

        PeriodModel.findOne({ _id: id, isDeleted: false }).populate("vechileCategorys").then((result) => {
            res.status(200).json({ message: CommonMessage.getPeriod.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getPeriod.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.tooglePeriod = async (req, res) => {
    try {
        const { id } = req.params

        let periodDetails = await PeriodModel.findOne({ _id: id, isDeleted: false })

        if (!periodDetails) {
            return res.status(200).json({ message: CommonMessage.tooglePeriod.notfound, success: false })
        }

        PeriodModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isActive: !periodDetails.isActive }, { new: true }).populate("vechileCategorys").then((result) => {
            res.status(200).json({ message: result.isActive ? CommonMessage.tooglePeriod.active : CommonMessage.tooglePeriod.deactive, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getPeriod.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}

exports.deletePeriod = async (req, res) => {
    try {
        const { id } = req.params

        let periodDetails = await PeriodModel.findOne({ _id: id, isDeleted: false })

        if (!periodDetails) {
            return res.status(200).json({ message: CommonMessage.deletePeriod.notfound, success: false })
        }

        PeriodModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true }).populate("vechileCategorys").then((result) => {
            res.status(200).json({ message: CommonMessage.deletePeriod.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.getPeriod.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(CommonMessage.commonError(error))
    }
}