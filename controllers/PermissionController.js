const { commonError, permission } = require("../helpers/CommonMessage")
const { pagination } = require("../helpers/Helpers")
const PermissionModel = require("../models/PermissionModel")

exports.createPermission = (req, res) => {
    try {
        const { name, description, platform, module, isRead, isWrite, isDelete, isAdmin, isActive } = req.body

        PermissionModel.create({ name, description, platform, module, isRead, isWrite, isDelete, isAdmin, isActive }).then((details) => {
            res.status(201).json({ message: permission.create.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: permission.create.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updatePermission = (req, res) => {
    try {
        const { permission_id } = req.params
        const { name, description, platform, isRead, isWrite, isDelete, isAdmin } = req.body

        PermissionModel.findOneAndUpdate({ _id: permission_id }, { name, description, platform, isRead, isWrite, isDelete, isAdmin }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: permission.update.notFound, success: false })
            }
            res.status(200).json({ message: permission.update.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: permission.update.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.togglePermission = (req, res) => {
    try {
        const { permission_id } = req.params

        PermissionModel.findOneAndUpdate({ _id: permission_id }, [{ $set: { isActive: [false, '$isActive'] } }], { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: permission.toggle.notFound, success: false })
            }
            res.status(200).json({ message: details.isActive ? permission.toggle.active : permission.toggle.deActive, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: permission.toggle.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.deletePermission = (req, res) => {
    try {
        const { permission_id } = req.params

        PermissionModel.findOneAndUpdate({ _id: permission_id }, { isDeleted: true }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: permission.delete.notFound, success: false })
            }
            res.status(200).json({ message: permission.delete.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: permission.delete.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getActivePermission = async (req, res) => {
    try {
        const { usertype } = req
        const search = req.query.search || ''
        const limit = req.query.limit || 10
        const page = req.query.page || 1

        const pagination_object = pagination(limit, page, await PermissionModel.countDocuments({ platform: usertype, isActive: true, name: { $regex: search, $options: 'i' } }))

        PermissionModel.find({ platform: usertype, isActive: true, name: { $regex: search, $options: 'i' } }).limit(pagination_object.limit).skip(pagination_object.skip).then((details) => {
            res.status(200).json({ message: permission.getAll.success, success: true, data: details, pagination: pagination_object })
        }).catch((error) => {
            res.status(400).json({ message: permission.getAll.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getPermissions = async (req, res) => {
    try {
        const search = req.query.search || ''
        const limit = req.query.limit || 10
        const page = req.query.page || 1

        const pagination_object = pagination(limit, page, await PermissionModel.countDocuments({ name: { $regex: search, $options: 'i' } }))

        PermissionModel.find({ name: { $regex: search, $options: 'i' } }).limit(pagination_object.limit).skip(pagination_object.skip).then((details) => {
            res.status(200).json({ message: permission.getAll.success, success: true, data: details, pagination: pagination_object })
        }).catch((error) => {
            res.status(400).json({ message: permission.getAll.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getPermissionDetails = async (req, res) => {
    try {
        const { permission_id } = req.params

        PermissionModel.findOne({ _id: permission_id }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: permission.getSingle.notFound, success: false })
            }
            res.status(200).json({ message: permission.getSingle.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: permission.getSingle.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}