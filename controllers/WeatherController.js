const { commonError, weather } = require("../helpers/CommonMessage")
const { pagination } = require("../helpers/Helpers")
const WeatherModel = require("../models/WeatherModel")

exports.createWeather = (req, res) => {
    try {
        const { name } = req.body

        WeatherModel.create({ name }).then((details) => {
            res.status(200).json({ message: weather.create.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: weather.create.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updateWeather = (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        WeatherModel.findOneAndUpdate({ _id: id }, { name, alias: name.replaceAll(/\s/g, '-').toLowerCase() }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: weather.update.notfound, success: false })
            }
            res.status(200).json({ message: weather.update.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: weather.update.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.deleteWeather = (req, res) => {
    try {
        const { id } = req.params

        WeatherModel.findOneAndUpdate({ _id: id }, { isDeleted: true }).then((detail) => {
            if (!detail) {
                return res.status(400).json({ message: weather.delete.notfound, success: false })
            }
            res.status(200).json({ message: weather.delete.success, success: true })
        }).catch((error) => {
            res.status(400).json({ message: weather.delete.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.toggleWeather = (req, res) => {
    try {
        const { id } = req.params

        WeatherModel.findOneAndUpdate({ _id: id }, [{ $set: { isActive: { $eq: [false, "$isActive"] } } }], { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: weather.toggle.notfound, success: false })
            }
            res.status(200).json({ message: details.isActive ? weather.toggle.active : weather.toggle.deactive, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: weather.toggle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getAllWeather = async (req, res) => {
    try {

        const paginationObject = pagination(req.query.limit || 10, req.query.page || 1, await WeatherModel.countDocuments());

        WeatherModel.find().skip(paginationObject.skip).limit(paginationObject.limit).then((details) => {
            res.status(200).json({ message: weather.getAll.success, success: true, data: details, pagination: paginationObject })
        }).catch((error) => {
            res.status(400).json({ message: weather.getAll.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getActiveWeather = async (req, res) => {
    try {
        WeatherModel.find({ isActive: true }).then((details) => {
            res.status(200).json({ message: weather.getAll.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: weather.getAll.failed, success: false, error: error.stack })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleWeather = (req, res) => {
    try {
        const { id } = req.params

        WeatherModel.findOne({ _id: id }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: weather.getSingle.notfound, success: false })
            }
            res.status(200).json({ message: weather.getSingle.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: weather.getSingle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}