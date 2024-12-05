const { commonError, notification } = require("../helpers/CommonMessage")
const { pagination } = require("../helpers/Helpers")
const NotificationModel = require("../models/NotificationModel")

exports.getAllNotification = async (req, res) => {
    try {
        const { usertype: userType, userdetails: userDetails } = req

        const paginationObject = pagination(req.query.limit || 10, req.query.page || 1, await NotificationModel.countDocuments({ [userType]: userDetails._id }))

        NotificationModel.find({ [userType]: userDetails._id }).sort({ createdAt: -1 }).limit(paginationObject.limit).skip(paginationObject.skip).populate('crewInvitation riderInvitation').then((result) => {
            res.status(200).json({ message: notification.getAll.success, success: true, data: result, pagination: paginationObject })
        }).catch((error) => {
            res.status(409).json({ message: notification.getAll.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleNotification = (req, res) => {
    try {
        const { notificationId } = req.params
        const { usertype: userType, userdetails: userDetails } = req

        NotificationModel.findOne({ _id: notificationId, [userType]: userDetails._id }).populate('crewInvitation').then((result) => {
            if (!result) {
                return res.status(400).json({ message: notification.getSingle.notfound, success: false })
            }
            result.isRead = true
            result.save()
            res.status(200).json({ message: notification.getSingle.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: notification.getSingle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.makeAsRead = (req, res) => {
    try {
        const { notificationId } = req.params
        const { usertype: userType, userdetails: userDetails } = req

        NotificationModel.findOne({ _id: notificationId, [userType]: userDetails._id }).then((result) => {
            if (!result) {
                return res.status(400).json({ message: notification.makeRead.notfound, success: false })
            }
            result.isRead = true
            result.save()
            res.status(200).json({ message: notification.makeRead.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: notification.makeRead.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}