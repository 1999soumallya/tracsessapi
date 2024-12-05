const { designation, commonError } = require("../helpers/CommonMessage")
const { pagination } = require("../helpers/Helpers")
const DesignationModel = require("../models/DesignationModel")

exports.createDesignation = (req, res) => {
    try {
        const { name, isActive } = req.body

        DesignationModel.create({ name, isActive }).then((result) => {
            res.status(200).json({ message: designation.create.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: designation.create.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updateDesignation = (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        DesignationModel.findOneAndUpdate({ _id: id }, { name, alias: name.replaceAll(/\s/g, '') }, { new: true }).then((result) => {
            res.status(200).json({ message: designation.update.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: designation.update.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.deleteDesignation = (req, res) => {
    try {
        const { id } = req.params

        DesignationModel.findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true }).then((result) => {
            if (!result) {
                return res.status(400).json({ message: designation.delete.notfound, success: false })
            }
            res.status(200).json({ message: designation.delete.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: designation.delete.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.toggleDesignation = async (req, res) => {
    try {
        const { id } = req.params

        const details = await DesignationModel.findOne({ _id: id })

        if (!details) {
            return res.status(400).json({ message: designation.toggle.notfound, success: false })
        }

        DesignationModel.findOneAndUpdate({ _id: id }, { isActive: !details.isActive }, { new: true }).then((result) => {
            res.status(200).json({ message: result.isActive ? designation.toggle.active : designation.toggle.deactive, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: designation.toggle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getAllDesignation = async (req, res) => {
    try {

        const paginationObject = pagination(req.query.limit || 10, req.query.page || 1, await DesignationModel.countDocuments({ isDeleted: false }))

        DesignationModel.find().skip(paginationObject.skip).limit(paginationObject.limit).then((result) => {
            res.status(200).json({ message: designation.getAll.success, success: true, data: result, pagination: paginationObject })
        }).catch((error) => {
            res.status(400).json({ message: designation.getAll.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleDesignation = async (req, res) => {
    try {
        const { id } = req.params

        DesignationModel.findOne({ _id: id }).then((result) => {
            if (!result) {
                return res.status(400).json({ message: designation.getSingle.notfound, success: false })
            }
            res.status(200).json({ message: designation.getSingle.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: designation.getSingle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getActiveDesignation = async (req, res) => {
    try {

        DesignationModel.find({ isActive: true }).then((result) => {
            res.status(200).json({ message: designation.getAll.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: designation.getAll.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}