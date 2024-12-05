const { commonError, gender } = require("../helpers/CommonMessage")
const { pagination } = require("../helpers/Helpers")
const GenderModel = require("../models/GenderModel")

exports.addGender = (req, res) => {
    try {
        const { name, isActive } = req.body

        GenderModel.create({ name, isActive }).then((details) => {
            res.status(200).json({ message: gender.create.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: gender.create.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updateGender = (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        GenderModel.findOneAndUpdate({ _id: id }, { name, alias: name.replaceAll(/\s/g, '-').toLowerCase() }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: gender.update.notfound, success: false })
            }

            res.status(200).json({ message: gender.update.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: gender.update.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.deleteGender = (req, res) => {
    try {
        const { id } = req.params

        GenderModel.findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: gender.delete.notfound, success: false })
            }

            res.status(200).json({ message: gender.delete.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: gender.delete.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.toggleGender = async (req, res) => {
    try {
        const { id } = req.params

        const details = await GenderModel.findOne({ _id: id })

        if (!details) {
            return res.status(400).json({ message: gender.toggle.notfound, success: false })
        }

        GenderModel.findOneAndUpdate({ _id: id }, { isActive: !details.isActive }, { new: true }).then((newDetails) => {
            res.status(200).json({ message: newDetails.isActive ? gender.toggle.active : gender.toggle.deactive, success: true, data: newDetails })
        }).catch((error) => {
            res.status(400).json({ message: gender.toggle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getAllGender = async (req, res) => {
    try {

        const paginationObject = pagination(req.query.limit || 10, req.query.page || 1, await GenderModel.countDocuments())

        GenderModel.find().skip(paginationObject.skip).limit(paginationObject.limit).then((details) => {
            res.status(200).json({ message: gender.getAll.success, success: true, data: details, pagination: paginationObject })
        }).catch((error) => {
            res.status(400).json({ message: gender.getAll.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleGender = (req, res) => {
    try {
        const { id } = req.params

        GenderModel.findOne({ _id: id }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: gender.getSingle.notfound, success: false })
            }
            res.status(200).json({ message: gender.getSingle.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: gender.getSingle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getAllActiveGender = async (req, res) => {
    try {

        GenderModel.find({ isActive: true }).then((details) => {
            res.status(200).json({ message: gender.getAll.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: gender.getAll.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}