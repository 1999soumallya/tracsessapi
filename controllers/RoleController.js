const { commonError, role } = require("../helpers/CommonMessage")
const { pagination } = require("../helpers/Helpers")
const RoleModel = require("../models/RoleModel")

exports.createRole = (req, res) => {
    try {
        const { userdetails, usertype } = req
        const { name, permissions, isActive } = req.body

        RoleModel.create({ [usertype]: userdetails._id, name, platform: usertype, permissions, isActive }).then((details) => {
            res.status(201).json({ message: role.create.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: role.create.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updateRole = (req, res) => {
    try {
        const { userdetails, usertype } = req
        const { role_id } = req.params
        const { name, permissions } = req.body

        RoleModel.findOneAndUpdate({ _id: role_id, [usertype]: userdetails._id, platform: usertype }, { name, alias: name.replace(/\s/g, '-').toLowerCase(), $addToSet: { permissions: { $each: permissions } } }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: role.update.notFound, success: false })
            }
            res.status(200).json({ message: role.update.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: role.update.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.removeRolePermission = (req, res) => {
    try {
        const { userdetails, usertype } = req
        const { role_id, permissions } = req.body

        RoleModel.findOneAndUpdate({ _id: role_id, [usertype]: userdetails._id, platform: usertype }, { $pull: { permissions } }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: role.removePermission.notFound, success: false })
            }
            res.status(200).json({ message: role.removePermission.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: role.removePermission.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.toggleRole = (req, res) => {
    try {
        const { userdetails, usertype } = req
        const { role_id } = req.params

        RoleModel.findOneAndUpdate({ [usertype]: userdetails._id, platform: usertype, _id: role_id }, [{ $set: { isActive: [false, '$isActive'] } }], { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: role.toggle.notFound, success: false })
            }
            res.status(200).json({ message: details.isActive ? role.toggle.active : role.toggle.deActive, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: role.toggle.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.deleteRole = (req, res) => {
    try {
        const { userdetails, usertype } = req
        const { role_id } = req.params

        RoleModel.findOneAndUpdate({ [usertype]: userdetails._id, platform: usertype, _id: role_id }, { isDeleted: true }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: role.delete.notFound, success: false })
            }
            res.status(200).json({ message: role.delete.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: role.delete.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getActiveRole = async (req, res) => {
    try {
        const { userdetails, usertype } = req
        const search = req.query.search || ''
        const limit = req.query.limit || 10
        const page = req.query.page || 1

        const pagination_object = pagination(limit, page, await RoleModel.countDocuments({ [usertype]: userdetails._id, platform: usertype, isActive: true, name: { $regex: search, $options: 'i' } }))

        RoleModel.find({ [usertype]: userdetails._id, platform: usertype, isActive: true, name: { $regex: search, $options: 'i' } }).limit(pagination_object.limit).skip(pagination_object.skip).then((details) => {
            res.status(200).json({ message: role.getAll.success, success: true, data: details, pagination: pagination_object })
        }).catch((error) => {
            res.status(400).json({ message: role.getAll.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getRoles = async (req, res) => {
    try {
        const { userdetails, usertype } = req
        const search = req.query.search || ''
        const limit = req.query.limit || 10
        const page = req.query.page || 1

        const pagination_object = pagination(limit, page, await RoleModel.countDocuments({ [usertype]: userdetails._id, platform: usertype, name: { $regex: search, $options: 'i' } }))

        RoleModel.find({ [usertype]: userdetails._id, platform: usertype, name: { $regex: search, $options: 'i' } }).limit(pagination_object.limit).skip(pagination_object.skip).then((details) => {
            res.status(200).json({ message: role.getAll.success, success: true, data: details, pagination: pagination_object })
        }).catch((error) => {
            res.status(400).json({ message: role.getAll.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getRoleDetails = async (req, res) => {
    try {
        const { userdetails, usertype } = req
        const { role_id } = req.params

        RoleModel.findOne({ [usertype]: userdetails._id, platform: usertype, _id: role_id }).populate('permissions').then((details) => {
            if (!details) {
                return res.status(400).json({ message: role.getSingle.notFound, success: false })
            }
            res.status(200).json({ message: role.getSingle.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: role.getSingle.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}