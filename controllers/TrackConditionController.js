const { commonError, trackCondition } = require("../helpers/CommonMessage")
const { pagination } = require("../helpers/Helpers")
const TrackConditionModel = require("../models/TrackConditionModel")

exports.addCondition = (req, res) => {
    try {

        const { name } = req.body

        TrackConditionModel.create({ name }).then((result) => {
            res.status(200).json({ message: trackCondition.create.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: trackCondition.create.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updateCondition = (req, res) => {
    try {

        const { id } = req.params;
        const { name } = req.body;

        TrackConditionModel.findOneAndUpdate({ _id: id }, { name, alias: name.replaceAll(/\s/g, '-').toLowerCase() }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: trackCondition.update.notfound, success: false })
            }
            res.status(200).json({ message: trackCondition.update.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: trackCondition.update.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.deleteCondition = (req, res) => {
    try {

        const { id } = req.params

        TrackConditionModel.findOneAndUpdate({ _id: id }, { isDeleted: true }).then((result) => {
            if (!result) {
                return res.status(400).json({ message: trackCondition.delete.notfound, success: false })
            }
            res.status(200).json({ message: trackCondition.delete.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: trackCondition.delete.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.toggleCondition = (req, res) => {
    try {
        const { id } = req.params

        TrackConditionModel.findOneAndUpdate({ _id: id }, [{ $set: { isActive: { $eq: [false, "$isActive"] } } }], { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: trackCondition.toggle.notfound, success: false })
            }
            res.status(200).json({ message: details.isActive ? trackCondition.toggle.active : trackCondition.toggle.deactive, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: trackCondition.toggle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getAllCondition = async (req, res) => {
    try {

        const paginationObject = pagination(req.query.limit || 10, req.query.page || 1, await TrackConditionModel.countDocuments());

        TrackConditionModel.find().skip(paginationObject.skip).limit(paginationObject.limit).then((result) => {
            res.status(200).json({ message: trackCondition.getAll.success, success: true, data: result, pagination: paginationObject })
        }).catch((error) => {
            res.status(400).json({ message: trackCondition.getAll.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getActiveCondition = async (req, res) => {
    try {
        TrackConditionModel.find({ isActive: true }).then((details) => {
            res.status(200).json({ message: trackCondition.getAll.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: trackCondition.getAll.failed, success: false, error: error.stack })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleCondition = (req, res) => {
    try {
        const { id } = req.params

        TrackConditionModel.findOne({ _id: id }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: trackCondition.getSingle.notfound, success: false })
            }
            res.status(200).json({ message: trackCondition.getSingle.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: trackCondition.getSingle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}