const CommonMessage = require("../helpers/CommonMessage")
const { uploadFileS3Client } = require("../helpers/Helpers")
const UUID = require('uuid')

exports.imageUploadController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: CommonMessage.fileupload.failed, success: false })
        }

        if (req.imageValidationError) {
            return res.status(400).json({ message: req.imageValidationError, success: false })
        }

        uploadFileS3Client(req.file, UUID.v4(), 'image').then((result) => {
            res.status(200).json({ message: CommonMessage.fileupload.success, success: true, data: result.location })
        }).catch((error) => {
            res.status(400).json({ message: CommonMessage.fileupload.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(400).json(CommonMessage.commonError(error))
    }
}