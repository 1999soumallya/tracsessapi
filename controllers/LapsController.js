const { commonError, laps } = require("../helpers/CommonMessage")
const LapsModel = require("../models/LapsModel")
const VehicleSetupModel = require("../models/VehicleSetupModel")
const SessionSetupModel = require("../models/SessionSetupModel")
const SetupRidersModel = require("../models/SetupRidersModel")
const SetupVehicleModel = require("../models/SetupVehicleModel")

exports.createLaps = async (req, res) => {
    try {
        const { vehicleSetupId, lapTimings } = req.body

        if (lapTimings && lapTimings.length > 0) {
            for (let index = 0; index < lapTimings.length; index++) {
                const lapTiming = lapTimings[index];
                let MM = Number(lapTiming.split(':')[0]), SS = Number(lapTiming.split(':')[1])

                const total_frames = (MM * 60 + SS) * 30
                const setup_details = await VehicleSetupModel.findOne({ _id: vehicleSetupId })

                if (!setup_details) {
                    return res.status(400).json({ message: laps.create.notfound, success: false })
                }

                LapsModel.create({ vehicleSetup: vehicleSetupId, lapTiming, totalFrames: total_frames })
            }
            res.status(200).json({ message: laps.create.success, success: true, })
        } else {
            return res.status(400).json({ message: laps.create.success, success: false })
        }

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.createMultipleLaps = async (req, res) => {
    try {
        const { multipleLaps } = req.body

        if (multipleLaps && multipleLaps.length > 0) {
            multipleLaps.forEach(element => {
                const { vehicleSetupId, lapTimings } = element;

                if (lapTimings && lapTimings.length > 0) {

                    VehicleSetupModel.findOne({ _id: vehicleSetupId }).then((setup_details) => {

                        if (setup_details) {
                            lapTimings.forEach(lap_element => {
                                let MM = Number(lap_element.split(':')[0]), SS = Number(lap_element.split(':')[1])
                                const total_frames = (MM * 60 + SS) * 30
                                LapsModel.create({ vehicleSetup: setup_details._id, lapTiming: lap_element, totalFrames: total_frames }).then((lap_details) => {
                                    return lap_details
                                })
                            })
                            return true
                        } else {
                            return false
                        }

                    })

                }

            });

            res.status(200).json({ message: laps.create.success, success: true, })
        } else {
            return res.status(200).json({ message: laps.create.success, success: false })
        }

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getLaps = async (req, res) => {
    try {
        const { vehicleSetupId } = req.params

        const total_laps = await LapsModel.countDocuments({ vehicleSetup: vehicleSetupId })
        const best_lap = await LapsModel.findOne({ vehicleSetup: vehicleSetupId }).sort({ totalFrames: 1 })

        LapsModel.find({ vehicleSetup: vehicleSetupId }).sort({ totalFrames: 1 }).then((details) => {
            res.status(200).json({ message: laps.get.success, success: true, data: details, total: total_laps, best: best_lap })
        }).catch((error) => {
            res.status(400).json({ message: laps.get.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getLapsUser = async (req, res) => {
    try {
        const { userdetails } = req
        const { sessionId } = req.params

        const session_setups = await SessionSetupModel.find({ session: sessionId })

        if (session_setups.length === 0) {
            return res.status(200).json({ message: laps.get.success, success: true, data: [] })
        }

        const sessions_setups_id = session_setups.map((session_setups) => session_setups._id)

        const setup_riders = await SetupRidersModel.find({ sessionSetupId: { $in: sessions_setups_id }, rider: userdetails._id })

        if (setup_riders.length === 0) {
            return res.status(200).json({ message: laps.get.success, success: true, data: [] })
        }

        let vehicle_details_id = await setup_riders.flatMap((setup_riders) => setup_riders.vehicleDetails)

        let vehicle_setups_id = await SetupVehicleModel.find({ _id: { $in: vehicle_details_id } }).populate('vehicle')

        const response_array = await vehicle_setups_id.map(async (vehicle_setups) => ({ vehicle: vehicle_setups.vehicle, vehicleSetups: await VehicleSetupModel.find({ _id: { $in: vehicle_setups.setups } }, { name: 1 }).populate('laps') }))

        await Promise.all(response_array).then((result) => {
            res.status(200).json({ message: laps.get.success, data: result, success: true })
        }).catch((error) => {
            res.status(400).json({ message: laps.get.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}