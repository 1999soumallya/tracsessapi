const { commonError, direction } = require("../helpers/CommonMessage")
const { pagination } = require("../helpers/Helpers")
const DirectionModel = require("../models/DirectionModel.js")

exports.addDirection = (req, res) => {
    try {

        const { name } = req.body

        DirectionModel.create({ name }).then((result) => {
            res.status(200).json({ message: direction.create.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: direction.create.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updateDirection = (req, res) => {
    try {

        const { id } = req.params;
        const { name } = req.body;

        DirectionModel.findOneAndUpdate({ _id: id }, { name, alias: name.replaceAll(/\s/g, '-').toLowerCase() }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: direction.update.notfound, success: false })
            }
            res.status(200).json({ message: direction.update.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: direction.update.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.deleteDirection = (req, res) => {
    try {

        const { id } = req.params

        DirectionModel.findOneAndUpdate({ _id: id }, { isDeleted: true }).then((result) => {
            if (!result) {
                return res.status(400).json({ message: direction.delete.notfound, success: false })
            }
            res.status(200).json({ message: direction.delete.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: direction.delete.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.toggleDirection = (req, res) => {
    try {
        const { id } = req.params

        DirectionModel.findOneAndUpdate({ _id: id }, [{ $set: { isActive: { $eq: [false, "$isActive"] } } }], { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: direction.toggle.notfound, success: false })
            }
            res.status(200).json({ message: details.isActive ? direction.toggle.active : direction.toggle.deactive, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: direction.toggle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getAllDirection = async (req, res) => {
    try {

        const paginationObject = pagination(req.query.limit || 10, req.query.page || 1, await DirectionModel.countDocuments());

        DirectionModel.find().skip(paginationObject.skip).limit(paginationObject.limit).then((result) => {
            res.status(200).json({ message: direction.getAll.success, success: true, data: result, pagination: paginationObject })
        }).catch((error) => {
            res.status(400).json({ message: direction.getAll.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getActiveDirection = async (req, res) => {
    try {
        DirectionModel.find({ isActive: true }).then((details) => {
            res.status(200).json({ message: direction.getAll.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: direction.getAll.failed, success: false, error: error.stack })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleDirection = (req, res) => {
    try {
        const { id } = req.params

        DirectionModel.findOne({ _id: id }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: direction.getSingle.notfound, success: false })
            }
            res.status(200).json({ message: direction.getSingle.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: direction.getSingle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}