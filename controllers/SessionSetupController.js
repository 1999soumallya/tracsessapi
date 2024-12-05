const { commonError, sessionSetup } = require("../helpers/CommonMessage")
const LapsModel = require("../models/LapsModel")
const SessionModel = require("../models/SessionModel")
const SessionSetupModel = require("../models/SessionSetupModel")
const SetupRidersModel = require("../models/SetupRidersModel")
const SetupVehicleModel = require("../models/SetupVehicleModel")
const VehicleSetupModel = require("../models/VehicleSetupModel")

exports.createSessionSetup = (req, res) => {
    try {
        const { tunersDetails } = req
        const { sessionId, name, trackConditionId, weatherId, temperature, wind, riderGroup } = req.body

        SessionSetupModel.create({ tuner: tunersDetails._id, session: sessionId, name, trackCondition: trackConditionId, weather: weatherId, temperature, wind: { speed: wind?.speed, direction: wind?.directionId } }).then(async (details) => {
            if (riderGroup && riderGroup.length > 0) {
                for (let index = 0; index < riderGroup.length; index++) {
                    const element = riderGroup[index];
                    const vehicle_group_id = []

                    if (element.vehicleDetails.length > 0) {
                        for (let j = 0; j < element.vehicleDetails.length; j++) {
                            const vehicleDetails = element.vehicleDetails[j];
                            const vehicle_group_details = await SetupVehicleModel.create({ vehicle: vehicleDetails.vehicleId, crewMembers: vehicleDetails.crewMembersId })
                            vehicle_group_id.push(vehicle_group_details._id)
                        }
                    }
                    await SetupRidersModel.create({ sessionSetupId: details._id, rider: element.riderId, vehicleDetails: vehicle_group_id })
                }
            }
            res.status(200).json({ message: sessionSetup.create.success(details.name), success: true })
        }).catch((error) => {
            res.status(400).json({ message: sessionSetup.create.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updateSessionSetup = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { session_setup_id } = req.params
        const { name, trackConditionId, weatherId, temperature, wind } = req.body

        const sessionSetupDetails = await SessionSetupModel.findOne({ _id: session_setup_id, tuner: tunersDetails._id })

        if (!sessionSetupDetails) {
            return res.status(400).json({ message: sessionSetup.update.notfound, success: false })
        }

        sessionSetupDetails.name = name || sessionSetupDetails.name
        sessionSetupDetails.weather = weatherId || sessionSetupDetails.weather
        sessionSetupDetails.trackCondition = trackConditionId || sessionSetupDetails.trackCondition
        sessionSetupDetails.temperature = {
            track: temperature?.track || sessionSetupDetails.temperature.track,
            ambient: temperature?.ambient || sessionSetupDetails.temperature.ambient
        }
        sessionSetupDetails.wind = {
            speed: wind?.speed || sessionSetupDetails.wind.speed,
            direction: wind?.directionId || sessionSetupDetails.wind.direction
        }

        sessionSetupDetails.save().then((details) => {
            res.status(200).json({ message: sessionSetup.update.success(details.name), success: true })
        }).catch((error) => {
            res.status(400).json({ message: sessionSetup.update.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSessionSetup = (req, res) => {
    try {
        const { tunersDetails } = req
        const { session_id } = req.params

        SessionSetupModel.find({ session: session_id, tuner: tunersDetails._id }, { tuner: 0, session: 0 }).populate([
            { path: 'wind.direction', select: 'name' },
            { path: 'trackCondition', select: 'name' },
            { path: 'weather', select: 'name' },
            {
                path: 'riderGroup', populate: [
                    { path: 'rider', select: 'firstName lastName image' },
                    {
                        path: 'vehicleDetails',
                        populate: [
                            { path: 'vehicle', select: '-createdAt -updatedAt -isDeleted -__v' },
                            { path: 'crewMembers', select: 'name designation specialization' }
                        ]
                    }
                ]
            }
        ]).then((details) => {
            res.status(200).json({ message: sessionSetup.get.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: sessionSetup.get.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleSessionSetup = (req, res) => {
    try {
        const { tunersDetails } = req
        const { session_setup_id } = req.params

        SessionSetupModel.findOne({ _id: session_setup_id, tuner: tunersDetails._id }, { tuner: 0, session: 0 }).populate([
            { path: 'wind.direction', select: 'name' },
            { path: 'trackCondition', select: 'name' },
            { path: 'weather', select: 'name' },
            {
                path: 'riderGroup', populate: [
                    { path: 'rider', select: 'firstName lastName image' },
                    {
                        path: 'vehicleDetails',
                        populate: [
                            { path: 'vehicle', select: '-createdAt -updatedAt -isDeleted -__v' },
                            { path: 'crewMembers', select: 'name designation specialization' }
                        ]
                    }
                ],
            }
        ]).then((details) => {
            res.status(200).json({ message: sessionSetup.get.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: sessionSetup.get.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.deleteSessionSetup = (req, res) => {
    try {
        const { session_setup_id } = req.params

        SessionSetupModel.findOneAndUpdate({ _id: session_setup_id }, { isDeleted: true }, { new: true }).then(async (details) => {
            if (!details) {
                return res.status(400).json({ message: sessionSetup.delete.notfound, success: false })
            }

            const ridersDetails = await SetupRidersModel.find({ sessionSetupId: details._id })

            await SetupRidersModel.updateMany({ sessionSetupId: details._id }, { $set: { isDeleted: true } })

            if (ridersDetails.length > 0) {
                const vehicles = await ridersDetails.flatMap((element) => (element.vehicleDetails))
                console.log(vehicles)
                await SetupVehicleModel.updateMany({ _id: { $in: vehicles } }, { $set: { isDeleted: true } })
            }

            res.status(200).json({ message: sessionSetup.delete.success, success: true })
        }).catch((error) => {
            res.status(400).json({ message: sessionSetup.delete.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.toggleSessionSetup = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { session_setup_id } = req.params

        const setupDetails = await SessionSetupModel.findOne({ _id: id, tuner: tunersDetails._id })

        if (!setupDetails) {
            return res.status(400).json({ message: sessionSetup.toggle.notfound, success: false })
        }

        SessionSetupModel.findOneAndUpdate({ _id: session_setup_id, tuner: tunersDetails._id }, { isActive: !setupDetails.isActive }, { new: true }).then((details) => {
            res.status(200).json({ message: details.isActive ? sessionSetup.toggle.active : sessionSetup.toggle.deactive, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: sessionSetup.toggle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.addRiders = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { session_setup_id } = req.params
        const { riderGroup } = req.body

        const setupDetails = await SessionSetupModel.findOne({ _id: session_setup_id, tuner: tunersDetails })

        if (!setupDetails) {
            return res.status(400).json({ message: sessionSetup.rider.notfound, success: false })
        }

        if (riderGroup && riderGroup.length > 0) {
            await riderGroup.map(element => {
                if (element.vehicleDetails && element.vehicleDetails.length > 0) {
                    element.vehicleDetails.map(vehicleDetails => {
                        SetupVehicleModel.create({ vehicle: vehicleDetails?.vehicleId, crewMembers: vehicleDetails?.crewMembersId }).then((result) => {
                            SetupRidersModel.create({ sessionSetupId: setupDetails._id, rider: element?.riderId, vehicleDetails: result._id }).then(() => {
                                return true
                            })
                        })
                    })
                } else {
                    SetupRidersModel.create({ sessionSetupId: setupDetails._id, rider: element?.riderId }).then(() => {
                        return true
                    })
                }
            })
        }

        res.status(200).json({ message: sessionSetup.rider.added, success: true })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.removeRiders = (req, res) => {
    try {
        const { rider_group_id } = req.params

        SetupRidersModel.findOneAndUpdate({ _id: rider_group_id }, { isDeleted: true }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: sessionSetup.rider.notfound, success: false })
            }

            res.status(200).json({ message: sessionSetup.rider.removed, success: true, data: details })
        }).catch((err) => {
            res.status(400).json({ message: sessionSetup.rider.failed, success: false, error: err.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.addVehicle = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { session_setup_id } = req.params
        const { riderVehicleDetails } = req.body

        const setupDetails = await SessionSetupModel.findOne({ _id: session_setup_id, tuner: tunersDetails._id })

        if (!setupDetails) {
            return res.status(400).json({ message: sessionSetup.rider.notfound, success: false })
        }

        if (riderVehicleDetails && riderVehicleDetails.length > 0) {
            await riderVehicleDetails.map(async ({ vehicleDetails, riderGroupId }) => {
                if (vehicleDetails && vehicleDetails.length > 0) {
                    await vehicleDetails.map(vehicleDetails => {
                        SetupVehicleModel.create({ vehicle: vehicleDetails?.vehicleId, crewMembers: vehicleDetails?.crewMembersId }).then((result) => {
                            SetupRidersModel.findOneAndUpdate({ sessionSetupId: setupDetails._id, _id: riderGroupId }, { $push: { vehicleDetails: result._id } }, { new: true }).then(() => {
                                return true
                            })
                        })
                    })
                }
            })
        }

        res.status(200).json({ message: sessionSetup.vehicle.added, success: true })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.removeVehicle = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { session_setup_id } = req.params
        const { riderVehicleDetails } = req.body

        const setupDetails = await SessionSetupModel.findOne({ _id: session_setup_id, tuner: tunersDetails })

        if (!setupDetails) {
            return res.status(400).json({ message: sessionSetup.rider.notfound, success: false })
        }

        if (riderVehicleDetails && riderVehicleDetails.length > 0) {
            await riderVehicleDetails.map(({ vehicleGroupId, riderGroupId }) => {
                SetupVehicleModel.findOneAndUpdate({ _id: vehicleGroupId }, { isDeleted: true }).then((result) => {
                    SetupRidersModel.findOneAndUpdate({ sessionSetupId: setupDetails._id, rider: riderGroupId }, { $pull: { vehicleDetails: result._id } }, { new: true }).then(() => {
                        return true;
                    })
                })
            })
        }

        res.status(200).json({ message: sessionSetup.vehicle.removed, success: true })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updateVehicle = async (req, res) => {
    try {
        const { vehicleDetails } = req.body

        if (vehicleDetails && vehicleDetails.length > 0) {
            for (let index = 0; index < vehicleDetails.length; index++) {
                const element = vehicleDetails[index];
                if (element.removeCrewMembersId && element.removeCrewMembersId.length > 0) {
                    await SetupVehicleModel.findOneAndUpdate({ _id: element.vehicleGroupId }, { $pull: { crewMembers: { $in: element.removeCrewMembersId } } })
                }
                if (element.crewMembersId && element.crewMembersId.length > 0) {
                    await SetupVehicleModel.findOneAndUpdate({ _id: element.vehicleGroupId }, { $addToSet: { crewMembers: { $each: element.crewMembersId } } })
                }
            }
        }

        res.status(200).json({ message: sessionSetup.vehicle.update, success: true })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.cloneSetup = (req, res) => {
    try {
        const { session_setup_id } = req.params

        SessionSetupModel.findOne({ _id: session_setup_id }).populate({
            path: 'riderGroup',
            populate: {
                path: 'vehicleDetails',
                populate: {
                    path: 'setups',
                    options: {
                        sort: { updatedAt: -1 },
                    },
                    justOne: true
                }
            }
        }).then((setup_details) => {
            if (!setup_details) {
                return res.status(400).json({ message: sessionSetup.cloneSetup.notfound, success: false })
            }


            SessionSetupModel.create({ tuner: setup_details.tuner, session: setup_details.session, name: `Copy of ${setup_details.name}`, alias: setup_details.alias, trackCondition: setup_details.trackCondition, weather: setup_details.weather, temperature: setup_details.temperature, wind: setup_details.wind }).then((new_setup_details) => {
                if (setup_details.riderGroup.length > 0) {
                    setup_details.riderGroup.forEach((rider_group) => {
                        SetupRidersModel.create({ sessionSetupId: new_setup_details._id, rider: rider_group.rider }).then((new_setup_rider_group) => {
                            rider_group.vehicleDetails.forEach(vehicle_details => {
                                console.log(vehicle_details)
                                if (vehicle_details.setups) {
                                    VehicleSetupModel.create({ name: vehicle_details.setups.name, alias: vehicle_details.setups.alias, tyre: vehicle_details.setups.tyre, suspension: vehicle_details.setups.suspension, sprockets: vehicle_details.setups.sprockets, }).then((new_vehicle_setup_details) => {
                                        SetupVehicleModel.create({ vehicle: vehicle_details.vehicle, crewMembers: vehicle_details.crewMembers, setups: [new_vehicle_setup_details._id] }).then((new_setup_vehicle_details) => {
                                            new_setup_rider_group.vehicleDetails.push(new_setup_vehicle_details._id)
                                            new_setup_rider_group.save().then(() => { 
                                                return
                                            })
                                        })
                                    })
                                }
                            })
                        })
                    })

                    return res.status(200).json({ message: sessionSetup.cloneSetup.success(setup_details.name), success: true, data: new_setup_details })
                } else {
                    return res.status(200).json({ message: sessionSetup.cloneSetup.success(setup_details.name), success: true, data: new_setup_details })
                }
            })
        }).catch((error) => {
            res.status(400).json({ message: sessionSetup.cloneSetup.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.cloneSetupForSession = async (req, res) => {
    try {
        const { old_session_id, new_session_id } = req.body


        const new_session_details = await SessionModel.findOne({ _id: new_session_id })

        if (!new_session_details) {
            return res.status(400).json({ message: sessionSetup.cloneSetupForSession.notfound, success: false })
        }


        SessionSetupModel.findOne({ session: old_session_id }).populate({
            path: 'riderGroup',
            populate: {
                path: 'vehicleDetails',
                populate: {
                    path: 'setups',
                    options: {
                        sort: { updatedAt: -1 },
                        limit: 1
                    },
                    populate: {
                        path: 'laps'
                    },
                }
            }
        }).sort({ createdAt: -1 }).then((setup_details) => {

            if (!setup_details) {
                return res.status(400).json({ message: sessionSetup.cloneSetupForSession.noSetup, success: false })
            }


            SessionSetupModel.create({ tuner: setup_details.tuner, session: new_session_id, name: `Copy of ${setup_details.name}`, alias: setup_details.alias, trackCondition: setup_details.trackCondition, weather: setup_details.weather, temperature: setup_details.temperature, wind: setup_details.wind }).then((new_setup_details) => {
                if (setup_details.riderGroup.length > 0) {
                    setup_details.riderGroup.forEach(async (rider_group) => {
                        let vehicleGroupArray = []

                        if (rider_group.vehicleDetails.length > 0) {
                            let setup_array = []
                            vehicleGroupArray = await rider_group.vehicleDetails.map(async vehicle_details => {
                                if (vehicle_details.setups.length > 0) {
                                    setup_array = await vehicle_details.setups.map(async vehicle_setup => {
                                        const vehicle_setup_details = await VehicleSetupModel.create({ name: vehicle_setup.name, alias: vehicle_setup.alias, tyre: vehicle_setup.tyre, suspension: vehicle_setup.suspension, sprockets: vehicle_setup.sprockets, })
                                        const laps_array = await vehicle_setup.laps.map((element) => ({ vehicleSetup: vehicle_setup_details._id, lapTiming: element.lapTiming, totalFrames: element.totalFrames }))
                                        await LapsModel.insertMany(laps_array)
                                        return vehicle_setup_details._id
                                    })
                                }
                                return await Promise.all(setup_array).then(async (new_setup_details) => {
                                    const vehicle_result = await SetupVehicleModel.create({ vehicle: vehicle_details.vehicle, crewMembers: vehicle_details.crewMembers, setups: new_setup_details })
                                    return vehicle_result._id
                                })
                            })
                        }

                        await Promise.all(vehicleGroupArray).then(async (new_vehicle_group_array) => {
                            console.log(new_vehicle_group_array)
                            await SetupRidersModel.create({ sessionSetupId: new_setup_details._id, rider: rider_group.rider, vehicleDetails: new_vehicle_group_array })
                        })
                    })
                }

                return res.status(200).json({ message: sessionSetup.cloneSetupForSession.success(setup_details.name, new_session_details.name), success: true, data: new_setup_details })
            })
        }).catch((error) => {
            res.status(400).json({ message: sessionSetup.cloneSetupForSession.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}