const UUID = require('uuid');
const { pagination, uploadFileS3Client } = require('../helpers/Helpers');
const ImageGallery = require('../models/ImageGallery');
const { commonError, track } = require('../helpers/CommonMessage');
const TrackModel = require('../models/TrackModel');

exports.addTrack = async (req, res) => {
    try {
        const { name, location, isActive } = req.body
        let fileName, imagePatch

        if (req.file) {
            fileName = UUID.v4()
            imagePatch = await (await uploadFileS3Client(req.file, fileName, 'trackImages')).location
        }

        TrackModel.create({ name, image: imagePatch, location, isActive }).then(async (details) => {
            if (req.file) {
                await ImageGallery.create({ track: details._id, imagePatch: imagePatch, fileName })
            }
            res.status(200).json({ message: track.create.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: track.create.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updateTrack = async (req, res) => {
    try {
        const { trackId } = req.params
        const { name, location } = req.body
        let fileName, imagePatch

        const details = await TrackModel.findOne({ _id: trackId })

        if (!details) {
            return res.status(400).json({ message: track.update.notfound, success: false })
        }

        if (req.file) {
            fileName = UUID.v4()
            imagePatch = await (await uploadFileS3Client(req.file, fileName, 'trackImages')).location
            await ImageGallery.create({ track: details._id, imagePatch, fileName })
            details.image = imagePatch
        }

        details.name = name
        details.location = location

        details.save().then((details) => {
            res.status(200).json({ message: track.update.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: track.update.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.deleteTrack = async (req, res) => {
    try {
        const { trackId } = req.params

        TrackModel.findOneAndUpdate({ _id: trackId }, { isDeleted: true }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: track.delete.notfound, success: false })
            }
            res.status(200).json({ message: track.delete.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: track.delete.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.toggleTrack = async (req, res) => {
    try {
        const { trackId } = req.params

        TrackModel.findOneAndUpdate({ _id: trackId }, [{ $set: { isActive: { $eq: [false, "$isActive"] } } }], { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: track.toggle.notfound, success: false })
            }
            res.status(200).json({ message: details.isActive ? track.toggle.active : track.toggle.deactive, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: track.toggle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getAllTrack = async (req, res) => {
    try {

        const paginationObject = pagination(req.query.limit || 10, req.query.page || 1, await TrackModel.countDocuments())

        TrackModel.find().skip(paginationObject.skip).limit(paginationObject.limit).then((details) => {
            res.status(200).json({ message: track.getAll.success, success: true, data: details, pagination: paginationObject })
        }).catch((error) => {
            res.status(400).json({ message: track.getAll.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleTrack = (req, res) => {
    try {
        const { trackId } = req.params
        TrackModel.findOne({ _id: trackId }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: track.getSingle.notfound, success: false })
            }
            res.status(200).json({ message: track.getSingle.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: track.getSingle.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getActiveTrack = async (req, res) => {
    try {

        TrackModel.find({ isActive: true }).then((details) => {
            res.status(200).json({ message: track.getAll.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: track.getAll.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}