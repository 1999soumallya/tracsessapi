const { commonError, vehicleSetup } = require("../helpers/CommonMessage")
const SetupVehicleModel = require('../models/SetupVehicleModel')
const VehicleSetupModel = require("../models/VehicleSetupModel")

exports.createVehicleSetup = async (req, res) => {
    try {
        const { vehicleGroupId } = req.params
        const { name, tyre, suspension, sprockets } = req.body

        const vehicleDetails = await SetupVehicleModel.findOne({ _id: vehicleGroupId })

        if (!vehicleDetails) {
            return res.status(400).json({ message: vehicleSetup.create.notFound, success: false })
        }

        const tyre_object = {
            front: {
                pressure: {
                    cold: tyre?.front?.pressure?.cold,
                    hot: tyre?.front?.pressure?.hot
                },
                temperature: tyre?.front?.temperature
            },
            rear: {
                pressure: {
                    cold: tyre?.rear?.pressure?.cold,
                    hot: tyre?.rear?.pressure?.hot
                },
                temperature: tyre?.rear?.temperature
            }
        }

        const suspensionObject = {
            sag: {
                front: suspension?.sag?.front,
                rear: suspension?.sag?.rear
            },
            dropHeight: {
                front: suspension?.dropHeight?.front,
                rear: suspension?.dropHeight?.rear
            },
            preload: {
                front: {
                    value: suspension?.preload?.front?.value,
                    settings: suspension?.preload?.front?.settingsId
                },
                rear: {
                    value: suspension?.preload?.rear?.value,
                    settings: suspension?.preload?.rear?.settingsId
                }
            },
            compression: {
                front: {
                    value: suspension?.compression?.front?.value,
                    settings: suspension?.compression?.front?.settingsId
                },
                rear: {
                    value: suspension?.compression?.rear?.value,
                    settings: suspension?.compression?.rear?.settingsId
                }
            },
            rebound: {
                front: {
                    value: suspension?.rebound?.front?.value,
                    settings: suspension?.rebound?.front?.settingsId
                },
                rear: {
                    value: suspension?.rebound?.rear?.value,
                    settings: suspension?.rebound?.rear?.settingsId
                }
            }
        }

        const sprockets_object = {
            front: sprockets?.front,
            rear: sprockets?.rear
        }

        VehicleSetupModel.create({ name, tyre: tyre_object, suspension: suspensionObject, sprockets: sprockets_object }).then((details) => {
            vehicleDetails.setups = [...vehicleDetails._doc.setups, details._id]
            vehicleDetails.save()
            res.status(200).json({ message: vehicleSetup.create.success(details.name), success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: vehicleSetup.create.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updateVehicleSetup = async (req, res) => {
    try {
        const { setupId } = req.params
        const { name, tyre, suspension, sprockets } = req.body

        const details = await VehicleSetupModel.findOne({ _id: setupId })

        if (!details) {
            return res.status(200).json({ message: vehicleSetup.update.notfound, success: false })
        }

        details.name = name || details.name
        details.alias = name ? name.replace(/\s/g, '-').toLowerCase() : details.alias
        details.tyre = {
            front: {
                pressure: {
                    cold: tyre?.front?.pressure?.cold || details.tyre.front.pressure.cold,
                    hot: tyre?.front?.pressure?.hot || details.tyre.front.pressure.hot
                },
                temperature: tyre?.front?.temperature || details.tyre.front.temperature
            },
            rear: {
                pressure: {
                    cold: tyre?.rear?.pressure?.cold || details.tyre.rear.pressure.cold,
                    hot: tyre?.rear?.pressure?.hot || details.tyre.rear.pressure.hot
                },
                temperature: tyre?.rear?.temperature || details.tyre.rear.temperature
            }
        }

        details.suspension = {
            sag: {
                front: suspension?.sag?.front || details.suspension.sag.front,
                rear: suspension?.sag?.rear || details.suspension.sag.rear
            },
            dropHeight: {
                front: suspension?.dropHeight?.front || details.suspension.dropHeight.front,
                rear: suspension?.dropHeight?.rear || details.suspension.dropHeight.rear
            },
            preload: {
                front: {
                    value: suspension?.preload?.front?.value || details.suspension.preload.front.value,
                    settings: suspension?.preload?.front?.settingsId || details.suspension.preload.front.settings
                },
                rear: {
                    value: suspension?.preload?.rear?.value || details.suspension.preload.rear.value,
                    settings: suspension?.preload?.rear?.settingsId || details.suspension.preload.rear.settings
                }
            },
            compression: {
                front: {
                    value: suspension?.compression?.front?.value || details.suspension.compression.front.value,
                    settings: suspension?.compression?.front?.settingsId || details.suspension.compression.front.settings
                },
                rear: {
                    value: suspension?.compression?.rear?.value || details.suspension.compression.rear.value,
                    settings: suspension?.compression?.rear?.settingsId || details.suspension.compression.rear.settings
                }
            },
            rebound: {
                front: {
                    value: suspension?.rebound?.front?.value || details.suspension.rebound?.front.value,
                    settings: suspension?.rebound?.front?.settingsId || details.suspension.rebound?.front.settings
                },
                rear: {
                    value: suspension?.rebound?.rear?.value || details.suspension.rebound?.rear.value,
                    settings: suspension?.rebound?.rear?.settingsId || details.suspension.rebound?.rear.settings
                }
            }
        }

        details.sprockets = {
            front: sprockets?.front || details.sprockets.front,
            rear: sprockets?.rear || details.sprockets.rear
        }

        details.save().then((details) => {
            if (!details) {
                return res.status(200).json({ message: vehicleSetup.update.notfound, success: false })
            }
            res.status(200).json({ message: vehicleSetup.update.success(details.name), success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: vehicleSetup.update.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.deleteVehicleSetup = (req, res) => {
    try {
        const { setupId } = req.params

        VehicleSetupModel.findOneAndUpdate({ _id: setupId }, { isDeleted: true }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: vehicleSetup.delete.notfound, success: false })
            }

            res.status(200).json({ message: vehicleSetup.delete.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: vehicleSetup.delete.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getVehicleSetup = (req, res) => {
    try {
        const { vehicleGroupId } = req.params

        SetupVehicleModel.findOne({ _id: vehicleGroupId }, { vehicle: 1, setups: 1 }).populate([
            { path: 'vehicle', populate: { path: 'vehicleType' } },
            {
                path: 'setups',
                match: { isDeleted: false },
                populate: [
                    { path: 'suspension.preload.front.settings', select: 'name' },
                    { path: 'suspension.preload.rear.settings', select: 'name' },
                    { path: 'suspension.compression.front.settings', select: 'name' },
                    { path: 'suspension.compression.rear.settings', select: 'name' },
                    { path: 'suspension.rebound.front.settings', select: 'name' },
                    { path: 'suspension.rebound.rear.settings', select: 'name' },
                    { path: 'laps', options: { sort: { totalFrames: 1 } } }
                ]
            }
        ]).then((details) => {
            if (!details) {
                return res.status(400).json({ message: vehicleSetup.get.notfound, success: false })
            }
            const newObject = details.setups.map((elements) => ({ ...elements._doc, lapDetails: elements.laps[0], totalLaps: elements?.laps?.length }))

            res.status(200).json({ message: vehicleSetup.get.success, success: true, data: { ...details._doc, setups: newObject } })
        }).catch((error) => {
            res.status(400).json({ message: vehicleSetup.get.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleVehicleSetup = (req, res) => {
    try {
        const { setupId } = req.params

        VehicleSetupModel.findOne({ _id: setupId }).populate([
            { path: 'suspension.preload.front.settings', select: 'name' },
            { path: 'suspension.preload.rear.settings', select: 'name' },
            { path: 'suspension.compression.front.settings', select: 'name' },
            { path: 'suspension.compression.rear.settings', select: 'name' },
            { path: 'suspension.rebound.front.settings', select: 'name' },
            { path: 'suspension.rebound.rear.settings', select: 'name' },
            { path: 'laps' }
        ]).then((details) => {
            if (!details) {
                return res.status(400).json({ message: vehicleSetup.getSingle.notfound, success: false })
            }

            res.status(200).json({ message: vehicleSetup.getSingle.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: vehicleSetup.getSingle.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}