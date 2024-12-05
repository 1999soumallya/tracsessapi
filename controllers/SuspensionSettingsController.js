const { commonError, suspensionSettings } = require("../helpers/CommonMessage")
const { pagination } = require("../helpers/Helpers")
const SuspensionSettingModel = require("../models/SuspensionSettingModel")

exports.addSuspensionType = (req, res) => {
    try {
        const { name } = req.body

        SuspensionSettingModel.create({ name }).then((response) => {
            res.status(200).json({ message: suspensionSettings.create.success, success: true, data: response })
        }).catch((error) => {
            res.status(400).json({ message: suspensionSettings.create.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(400).json(commonError(error))
    }
}

exports.updateSuspensionType = (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        SuspensionSettingModel.findOneAndUpdate({ _id: id }, { name, alias: name.replace(/\s/g, '-').toLowerCase() }, { new: true }).then((response) => {
            if (!response) {
                return res.status(400).json({ message: suspensionSettings.update.notfound, success: false })
            }

            res.status(200).json({ message: suspensionSettings.update.success, success: true, data: response })
        }).catch((error) => {
            res.status(400).json({ message: suspensionSettings.update.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(400).json(commonError(error))
    }
}

exports.deleteSuspensionType = (req, res) => {
    try {
        const { id } = req.params

        SuspensionSettingModel.findOneAndUpdate({ _id: id }, { isDeleted: true }).then((response) => {
            if (!response) {
                return res.status(400).json({ message: suspensionSettings.delete.notfound, success: false })
            }

            res.status(200).json({ message: suspensionSettings.delete.success, success: true, data: response })
        }).catch((error) => {
            res.status(400).json({ message: suspensionSettings.delete.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(400).json(commonError(error))
    }
}

exports.toggleSuspensionType = async (req, res) => {
    try {
        const { id } = req.params

        const details = await SuspensionSettingModel.findOne({ _id: id })

        if (!details) {
            return res.status(400).json({ message: suspensionSettings.toggle.notfound, success: false })
        }

        SuspensionSettingModel.findOneAndUpdate({ _id: id }, { isActive: !details.isActive }, { new: true }).then((response) => {
            res.status(200).json({ message: response.isActive ? suspensionSettings.toggle.active : suspensionSettings.toggle.deactive, success: true, data: response })
        }).catch((error) => {
            res.status(400).json({ message: suspensionSettings.toggle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(400).json(commonError(error))
    }
}

exports.getSuspensionType = async (req, res) => {
    try {
        const limit = req.query.limit ? req.query.limit : 10
        const page = req.query.page ? req.query.page : 1

        const paginationObject = pagination(limit, page, await SuspensionSettingModel.countDocuments())

        SuspensionSettingModel.find().skip(paginationObject.skip).limit(paginationObject.limit).then((response) => {
            res.status(200).json({ message: suspensionSettings.getAll.success, success: true, data: response, pagination: paginationObject })
        }).catch((error) => {
            res.status(400).json({ message: suspensionSettings.getAll.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(400).json(commonError(error))
    }
}

exports.getActiveSuspensionType = (req, res) => {
    try {
        SuspensionSettingModel.find({ isActive: true }, { name: 1 }).then((response) => {
            res.status(200).json({ message: suspensionSettings.getAll.success, success: true, data: response })
        }).catch((error) => {
            res.status(400).json({ message: suspensionSettings.getAll.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(400).json(commonError(error))
    }
}
