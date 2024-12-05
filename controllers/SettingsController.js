const { commonError } = require("../helpers/CommonMessage")
const SettingsModel = require("../models/SettingsModel")

exports.createSettings = (req, res) => {
    try {
        const { setting, name, value } = req.body

        SettingsModel.create({ setting, name, value }).then((response) => {
            res.status(200).json({ message: "Settings created successfully", success: true, data: response })
        }).catch((error) => {
            res.status(400).json({ message: "Failed to create settings", success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updateSettings = (req, res) => {
    try {
        const { setting_id } = req.params
        const { setting, name, value } = req.body

        SettingsModel.findOneAndUpdate({ _id: setting_id }, { setting, name, value }, { new: true }).then((response) => {
            res.status(200).json({ message: "Settings update successfully", success: true, data: response })
        }).catch((error) => {
            res.status(400).json({ message: "Failed to create settings", success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.toggleSettings = (req, res) => {
    try {
        const { setting_id } = req.params

        SettingsModel.findOneAndUpdate({ _id: setting_id }, [{ $set: { isActive: { $eq: [false, '$isActive'] } } }], { new: true }).then((response) => {
            res.status(200).json({ message: response?.isActive ? "Settings successfully activated" : "Settings successfully deactivated", success: true, data: response })
        }).catch((error) => {
            res.status(400).json({ message: "Failed to delete settings", success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.deleteSettings = (req, res) => {
    try {
        const { setting_id } = req.params

        SettingsModel.findOneAndUpdate({ _id: setting_id }, { isDeleted: true }, { new: true }).then((response) => {
            res.status(200).json({ message: "Settings deleted successfully", success: true, data: response })
        }).catch((error) => {
            res.status(400).json({ message: "Failed to delete settings", success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getAllSettings = (req, res) => {
    try {
        SettingsModel.aggregate([
            { $match: { isDeleted: false, isActive: true } },
            { $project: { setting: 1, name: 1, value: 1 } },
            {
                $group: {
                    _id: '$setting',
                    // values: { $push: '$$ROOT' }
                    values: {
                        $push: {
                            _id: '$_id',
                            name: '$name',
                            value: '$value',
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    setting: '$_id',
                    values: 1
                }
            },
            // {
            //     $unset: '_id',
            // }
        ]).then((response) => {
            res.status(200).json({ message: "Settings fetched successfully", success: true, data: response })
        }).catch((error) => {
            res.status(400).json({ message: "Failed to fetch settings", success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getActiveSettings = (req, res) => {
    try {
        SettingsModel.find({ isActive: true }).then((response) => {
            res.status(200).json({ message: "Settings fetched successfully", success: true, data: response })
        }).catch((error) => {
            res.status(400).json({ message: "Failed to fetch settings", success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}