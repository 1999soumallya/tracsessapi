const { commonError, riderMembers } = require("../helpers/CommonMessage")
const { createInvitation, verifyInvitation } = require("../helpers/RiderHelpers")
const moment = require('moment-timezone')
const TunersModel = require("../models/TunersModel")
const RidersModel = require("../models/RidersModel")
const UserModel = require("../models/UserModel")
const NotificationModel = require("../models/NotificationModel")
const TunersEventModel = require("../models/TunersEventModel")
const SessionModel = require("../models/SessionModel")
const SessionSetupModel = require("../models/SessionSetupModel")
const SetupRidersModel = require("../models/SetupRidersModel")

exports.addRider = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { rider, eventId, riderId } = req.body

        if (riderId) {
            UserModel.findOne({ _id: riderId }).then((riderDetails) => {

                if (!riderDetails) {
                    return res.status(400).json({ message: riderMembers.added.notfound, success: false })
                }

                RidersModel.findOne({ creator: tunersDetails._id, rider: riderDetails._id, event: eventId }).then((details) => {

                    if (details) {
                        return res.status(400).json({ message: riderMembers.added.exists, success: false })
                    }

                    TunersEventModel.findOne({ _id: eventId }).then((eventDetails) => {
                        if (!eventDetails) {
                            return res.status(400).json({ message: riderMembers.added.notevent, success: false })
                        }

                        RidersModel.create({ creator: tunersDetails._id, event: eventId, inviteLink: createInvitation(tunersDetails._id, riderDetails._id), expire: eventDetails.toDate, rider: riderDetails._id }).then((details) => {
                            NotificationModel.create({ user: riderDetails._id, description: `You get a invitation from ${tunersDetails.name} to join the team`, category: 'riderInvitation', riderInvitation: details._id }).then(() => {
                                res.status(200).json({ message: riderMembers.added.success, success: true, data: details })
                            }).catch((error) => {
                                res.status(400).json({ message: riderMembers.added.failed, success: false, error: error.toString() })
                            })
                        }).catch((err) => {
                            res.status(400).json({ message: riderMembers.added.failed, success: false, error: err.toString() })
                        })

                    }).catch((err) => {
                        res.status(400).json({ message: riderMembers.added.failed, success: false, error: err.toString() })
                    })
                }).catch((err) => {
                    res.status(400).json({ message: riderMembers.added.failed, success: false, error: err.toString() })
                })

            }).catch((err) => {
                res.status(400).json({ message: riderMembers.added.failed, success: false, error: err.toString() })
            })
        } else {

            UserModel.findOne({ $or: [{ email: rider.toLowerCase() }, { phoneNumber: rider }] }).then((user_details) => {
                if (user_details) {
                    return res.status(400).json({ message: 'Provide rider id because this rider is already registered', success: false })
                }

                RidersModel.findOne({ creator: tunersDetails._id, riderDetails: rider, event: eventId }).then((details) => {

                    if (details) {
                        return res.status(400).json({ message: riderMembers.added.exists, success: false })
                    }

                    TunersEventModel.findOne({ _id: eventId }).then((eventDetails) => {
                        if (!eventDetails) {
                            return res.status(400).json({ message: riderMembers.added.notevent, success: false })
                        }

                        RidersModel.create({ creator: tunersDetails._id, event: eventId, inviteLink: createInvitation(tunersDetails._id, rider), expire: eventDetails.toDate, riderDetails: rider }).then((details) => {
                            res.status(200).json({ message: riderMembers.added.success, success: true, data: details })
                        }).catch((err) => {
                            res.status(400).json({ message: riderMembers.added.failed, success: false, error: err.toString() })
                        })

                    }).catch((err) => {
                        res.status(400).json({ message: riderMembers.added.failed, success: false, error: err.toString() })
                    })
                }).catch((err) => {
                    res.status(400).json({ message: riderMembers.added.failed, success: false, error: err.toString() })
                })

            })

        }

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.acceptInvitation = (req, res) => {
    try {
        const { userdetails } = req
        const { invitationLink } = req.body

        verifyInvitation(invitationLink).then((invitation) => {
            let details = invitation.payload

            if (details.creator == userdetails.id) {
                return res.status(400).json({ message: riderMembers.accept.owner, success: false })
            }

            if (details.member != userdetails.id) {
                return res.status(400).json({ message: riderMembers.accept.notValid, success: false })
            }

            let search = { rider: userdetails._id, creator: details.creator, inviteLink: invitationLink, expire: { $gte: moment().utc().format() }, status: "pending" }
            let update = { inviteLink: null, expire: null, status: "accepted" }

            TunersModel.findOne({ _id: details.creator, isActive: true }).then((creator) => {
                if (!creator) {
                    return res.status(400).json({ message: riderMembers.accept.notExists, success: false })
                }

                RidersModel.findOneAndUpdate(search, update, { new: true }).populate([{ path: 'creator' }, { path: 'rider' }, { path: 'event', populate: { path: 'name' } }]).then((details) => {
                    if (!details) {
                        return res.status(400).json({ message: riderMembers.accept.notValid, success: false })
                    }

                    NotificationModel.create({ tuners: details.creator._id, description: `${details.rider.firstName} ${details.rider.lastName} has accepted your invitation to join ${details?.event?.name?.name}`, category: 'riderInvitation', riderInvitation: details._id }).then(() => {
                        NotificationModel.create({ tuners: details.rider._id, description: `You accept invitation for ${details.creator.name}`, category: 'riderInvitation', riderInvitation: details._id }).then(() => {
                            res.status(200).json({ message: riderMembers.accept.success(creator.name), success: true, data: details })
                        }).catch((error) => {
                            res.status(200).json({ message: riderMembers.accept.success(creator.name), success: true, data: details })
                        })
                    }).catch((error) => {
                        res.status(200).json({ message: riderMembers.accept.success(creator.name), success: true, data: details })
                    })

                }).catch((err) => {
                    res.status(400).json({ message: riderMembers.accept.failed, success: false, error: err.toString() })
                })
            }).catch((err) => {
                res.status(400).json({ message: riderMembers.accept.failed, success: false, error: err.toString() })
            })

        }).catch((error) => {
            res.status(400).json({ message: riderMembers.accept.notfound, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.resendInvitation = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { riderId } = req.params

        const riderDetails = await RidersModel.findOne({ creator: tunersDetails._id, _id: riderId, })

        if (!riderDetails) {
            return res.status(400).json({ message: riderMembers.resend.notfound, success: false })
        }

        if (riderDetails.status == 'accepted' || riderDetails.status == 'declined') {
            return res.status(400).json({ message: riderMembers.resend.joined, success: false })
        }

        riderDetails.inviteLink = createInvitation(tunersDetails._id, riderDetails.rider || riderDetails.riderDetails)

        riderDetails.save().then((details) => {
            if (riderDetails.rider) {
                NotificationModel.findOneAndUpdate({ riderInvitation: details._id }, { isDeleted: false }, { new: true }).then(() => {
                    NotificationModel.create({ user: riderDetails.rider, description: `You get a invitation from ${tunersDetails.name} to join the team`, category: 'riderInvitation', riderInvitation: details._id }).then(() => {
                        res.status(200).json({ message: riderMembers.resend.success, success: true, data: details })
                    }).catch((error) => {
                        res.status(400).json({ message: riderMembers.resend.failed, success: false, error: error.toString() })
                    })
                })
            } else {
                res.status(200).json({ message: riderMembers.resend.success, success: true, data: details })
            }

        }).catch((err) => {
            res.status(400).json({ message: riderMembers.resend.failed, success: false, error: err.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.declineInvitation = (req, res) => {
    try {
        const { userdetails } = req
        const { invitationLink } = req.body

        verifyInvitation(invitationLink).then((invitation) => {
            let details = invitation.payload

            if (details.creator == userdetails.id) {
                return res.status(400).json({ message: riderMembers.accept.owner, success: false })
            }

            if (details.member != userdetails.id) {
                return res.status(400).json({ message: riderMembers.accept.notValid, success: false })
            }

            let search = { rider: userdetails._id, creator: details.creator, inviteLink: invitationLink, expire: { $gte: moment().utc().format() }, status: "pending" }
            let update = { inviteLink: null, expire: null, status: "declined" }

            TunersModel.findOne({ _id: details.creator, isActive: true }).then((creator) => {
                if (!creator) {
                    return res.status(400).json({ message: riderMembers.accept.notExists, success: false })
                }

                RidersModel.findOneAndUpdate(search, update, { new: true }).populate([{ path: 'creator' }, { path: 'rider' }, { path: 'event', populate: { path: 'name' } }]).then((details) => {
                    if (!details) {
                        return res.status(400).json({ message: riderMembers.accept.notValid, success: false })
                    }

                    NotificationModel.create({ tuners: details.creator._id, description: `${details.rider.firstName} ${details.rider.lastName} has declined your invitation to join ${details?.event?.name?.name}`, category: 'riderInvitation', riderInvitation: details._id }).then(() => {
                        NotificationModel.create({ tuners: details.rider._id, description: `You decline invitation for ${details.creator.name}`, category: 'riderInvitation', riderInvitation: details._id }).then(() => {
                            res.status(200).json({ message: riderMembers.accept.success(creator.name), success: true, data: details })
                        }).catch((error) => {
                            res.status(200).json({ message: riderMembers.accept.success(creator.name), success: true, data: details })
                        })
                    }).catch((error) => {
                        res.status(200).json({ message: riderMembers.accept.success(creator.name), success: true, data: details })
                    })

                }).catch((err) => {
                    res.status(400).json({ message: riderMembers.accept.failed, success: false, error: err.toString() })
                })
            }).catch((err) => {
                res.status(400).json({ message: riderMembers.accept.failed, success: false, error: err.toString() })
            })

        }).catch((error) => {
            res.status(400).json({ message: riderMembers.accept.notfound, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.removeRider = (req, res) => {
    try {
        const { tunersDetails } = req
        const { riderId } = req.params

        RidersModel.findOneAndUpdate({ creator: tunersDetails._id, _id: riderId }, { isDeleted: true }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: riderMembers.remove.notfound, success: false })
            }
            res.status(200).json({ message: riderMembers.remove.success, success: true, data: details })
        }).catch((err) => {
            res.status(400).json({ message: riderMembers.remove.failed, success: false, error: err.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getRiders = (req, res) => {
    try {
        const { tunersDetails } = req
        const { status } = req.query
        const { eventId } = req.params

        const request = { creator: tunersDetails._id, event: eventId }

        if (status) {
            Object.assign(request, { status })
        }

        RidersModel.find(request, { rider: 1, riderDetails: 1, status: 1 }).populate({ path: 'rider', select: 'firstName lastName email phoneNumber countryCode image' }).then((details) => {
            res.status(200).json({ message: riderMembers.get.success, success: true, data: details })
        }).catch((err) => {
            res.status(400).json({ message: riderMembers.get.failed, success: false, error: err.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleRider = (req, res) => {
    try {
        const { tunersDetails } = req
        const { riderId } = req.params

        RidersModel.findOne({ creator: tunersDetails._id, _id: riderId }, { rider: 1, riderDetails: 1, status: 1 }).populate({ path: 'rider', select: 'firstName lastName email phoneNumber countryCode image' }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: riderMembers.getSingle.notfound, success: false })
            }
            res.status(200).json({ message: riderMembers.getSingle.success, success: true, data: details })
        }).catch((err) => {
            res.status(400).json({ message: riderMembers.getSingle.failed, success: false, error: err.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.searchRider = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { search, event_id } = req.query

        const request = { creator: tunersDetails._id, $or: [{ status: { $ne: 'accepted' } }, { status: { $ne: 'pending' } }] }

        if (event_id) {
            Object.assign(request, { event: event_id })
        }

        const riderId = await RidersModel.find(request, { rider: 1, _id: 0 })

        let riderIds = []
        if (riderId.length > 0) {
            riderIds = await riderId.map((rider) => (rider.rider))
        }

        UserModel.find({ isActive: true, _id: { $nin: riderIds }, $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { phoneNumber: { $regex: search, $options: 'i' } }] }).then((users) => {
            res.status(200).json({ message: riderMembers.search.success, success: true, data: users })
        }).catch((error) => {
            res.status(400).json({ message: riderMembers.search.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSessionRiders = async (req, res) => {
    try {
        const { tunersDetails, paramentCrewParticipant, temporaryCrewParticipant } = req
        const { session_id } = req.params

        const findSessionRequest = { _id: session_id }

        if (temporaryCrewParticipant && temporaryCrewParticipant.length > 0) {
            Object.assign(findSessionRequest, { event: temporaryCrewParticipant.map((element) => element.eventId) })
        }

        SessionModel.findOne(findSessionRequest).then((session_details) => {
            if (!session_details) {
                return res.status(400).json({ message: riderMembers.sessionRiders.notFound, success: false })
            }

            SessionSetupModel.find({ session: session_details._id, $or: [{ tuner: tunersDetails._id }, { tuner: { $in: paramentCrewParticipant.length > 0 ? paramentCrewParticipant.map(crews => crews.creator) : [] } }] }).then((setup_details) => {
                if (setup_details.length > 0) {
                    SetupRidersModel.find({ sessionSetupId: { $in: setup_details.map(s => s._id) } }, { rider: 1, vehicleDetails: 1 }).populate([
                        {
                            path: 'rider',
                            select: 'firstName lastName email phoneNumber countryCode image location weightFullGear'
                        },
                        {
                            path: 'vehicleDetails',
                            select: 'vehicle crewMembers setups',
                            populate: [
                                {
                                    path: 'vehicle',
                                    select: '-user -__v -createdAt -updatedAt',
                                    populate: {
                                        path: 'vehicleType',
                                        select: '-__v -createdAt -updatedAt',
                                    }
                                },
                                {
                                    path: 'crewMembers',
                                    select: 'name mobile countryCode email image gender',
                                },
                                {
                                    path: 'setups',
                                    options: {
                                        sort: { updatedAt: -1 },
                                        limit: 1
                                    },
                                    populate: {
                                        path: 'laps'
                                    },
                                }
                            ]
                        }
                    ]).then(riders_details => {
                        if (riders_details.length > 0) {
                            return res.status(200).json({ message: riderMembers.sessionRiders.success, success: true, data: riders_details })
                        } else {
                            return res.status(200).json({ message: riderMembers.sessionRiders.noRiders, success: true, data: [] })
                        }
                    })
                } else {
                    return res.status(200).json({ message: riderMembers.sessionRiders.noRiders, success: true, data: [] })
                }
            }).catch((error) => {
                res.status(400).json({ message: riderMembers.sessionRiders.failed, success: false, error: error.stack })
            })
        }).catch((error) => {
            res.status(400).json({ message: riderMembers.sessionRiders.failed, success: false, error: error.stack })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}