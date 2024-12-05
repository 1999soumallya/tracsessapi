const Router = require("express").Router()

const { imageUploadController } = require("../controllers/ImageController")
const { imageUpload } = require("../helpers/FileUpload")


Router.post('/image-upload', imageUpload, imageUploadController)


module.exports = Router