const { commonError, relations } = require("../helpers/CommonMessage")
const { pagination } = require("../helpers/Helpers")
const RelationModel = require("../models/RelationModel")

exports.addRelation = (req, res) => {
    try {
        const { name, isActive } = req.body

        RelationModel.create({ relation: name, isActive }).then((details) => {
            res.status(200).json({ message: relations.create.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: relations.create.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updateRelation = (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        RelationModel.findOneAndUpdate({ _id: id }, { relation: name, alias: name.replaceAll(/\s/g, '-').toLowerCase() }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: relations.update.notfound, success: false })
            }

            res.status(200).json({ message: relations.update.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: relations.update.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.deleteRelation = (req, res) => {
    try {
        const { id } = req.params

        RelationModel.findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: relations.delete.notfound, success: false })
            }

            res.status(200).json({ message: relations.delete.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: relations.delete.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.toggleRelation = async (req, res) => {
    try {
        const { id } = req.params

        const details = await RelationModel.findOne({ _id: id })

        if (!details) {
            return res.status(400).json({ message: relations.toggle.notfound, success: false })
        }

        RelationModel.findOneAndUpdate({ _id: id }, { isActive: !details.isActive }, { new: true }).then((newDetails) => {
            res.status(200).json({ message: newDetails.isActive ? relations.toggle.active : relations.toggle.deactive, success: true, data: newDetails })
        }).catch((error) => {
            res.status(400).json({ message: relations.toggle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getAllRelation = async (req, res) => {
    try {

        const paginationObject = pagination(req.query.limit || 10, req.query.page || 1, await RelationModel.countDocuments())

        RelationModel.find().skip(paginationObject.skip).limit(paginationObject.limit).then((details) => {
            res.status(200).json({ message: relations.getAll.success, success: true, data: details, pagination: paginationObject })
        }).catch((error) => {
            res.status(400).json({ message: relations.getAll.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleRelation = (req, res) => {
    try {
        const { id } = req.params

        RelationModel.findOne({ _id: id }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: relations.getSingle.notfound, success: false })
            }
            res.status(200).json({ message: relations.getSingle.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: relations.getSingle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getAllActiveRelation = async (req, res) => {
    try {

        RelationModel.find({ isActive: true }).then((details) => {
            res.status(200).json({ message: relations.getAll.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: relations.getAll.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}