const { commonError, crewMembers } = require("../helpers/CommonMessage")
const { createInvitation, verifyInvitation } = require("../helpers/CrewHelpers")
const CrewMembersModel = require("../models/CrewMembersModel")
const moment = require('moment-timezone')
const TunersModel = require("../models/TunersModel")
const NotificationModel = require("../models/NotificationModel")
const TunersEventModel = require("../models/TunersEventModel")

exports.addMembers = (req, res) => {
    try {
        const { tunersDetails } = req
        const { tunerId, eventId, tuner } = req.body

        if (tunerId) {
            TunersModel.findOne({ _id: tunerId }).then((details) => {
                if (!details) {
                    return res.status(400).json({ message: crewMembers.added.notfound, success: false })
                }

                if (eventId) {
                    TunersEventModel.findOne({ _id: eventId, toDate: { $gte: moment().utc().format() } }).populate('name').then((event_details) => {
                        if (!event_details) {
                            return res.status(400).json({ message: crewMembers.added.eventNotFound, success: false })
                        }
                        CrewMembersModel.findOne({ creator: tunersDetails._id, eventId: eventId, member: details._id, $or: [{ status: 'accepted' }, { status: 'pending' }, { expire: { $lte: moment().utc().format() } }] }).then((invitation_details) => {
                            if (invitation_details) {
                                return res.status(400).json({ message: crewMembers.added.alreadyInvited, success: false })
                            }
                            CrewMembersModel.create({ creator: tunersDetails._id, eventId: event_details._id, inviteLink: createInvitation(tunersDetails._id, details._id), expire: event_details.toDate, member: details._id }).then((crew_details) => {
                                NotificationModel.create({ tuners: tunerId, description: `You got a invitation from ${tunersDetails.name} to join their Crew.`, category: 'crewInvitation', crewInvitation: crew_details._id }).then(() => {
                                    res.status(200).json({ message: crewMembers.added.temporary(details?.name, event_details.name.name), success: true, data: crew_details })
                                }).catch((error) => {
                                    res.status(400).json({ message: crewMembers.added.failed, success: false, error: error.toString() })
                                })
                            }).catch((error) => {
                                res.status(400).json({ message: crewMembers.added.failed, success: false, error: error.toString() })
                            })
                        }).catch((error) => {
                            res.status(400).json({ message: crewMembers.added.failed, success: false, error: error.toString() })
                        })
                    })
                } else {
                    CrewMembersModel.findOne({ creator: tunersDetails._id, eventId: eventId, member: details._id, $or: [{ status: 'accepted' }, { status: 'pending' }, { expire: { $lte: moment().utc().format() } }] }).then((invitation_details) => {
                        if (invitation_details) {
                            return res.status(400).json({ message: crewMembers.added.alreadyInvited, success: false })
                        }
                        CrewMembersModel.create({ creator: tunersDetails._id, eventId, inviteLink: createInvitation(tunersDetails._id, details._id), expire: moment().utc().add(5, 'days').format(), member: details._id }).then((crew_details) => {
                            NotificationModel.create({ tuners: tunerId, description: `You got a invitation from ${tunersDetails.name} to join their Crew.`, category: 'crewInvitation', crewInvitation: crew_details._id }).then(() => {
                                res.status(200).json({ message: crewMembers.added.permanent(details?.name), success: true, data: crew_details })
                            }).catch((error) => {
                                res.status(400).json({ message: crewMembers.added.failed, success: false, error: error.toString() })
                            })
                        }).catch((error) => {
                            res.status(400).json({ message: crewMembers.added.failed, success: false, error: error.toString() })
                        })
                    }).catch((error) => {
                        res.status(400).json({ message: crewMembers.added.failed, success: false, error: error.toString() })
                    })
                }

            }).catch((error) => {
                res.status(400).json({ message: crewMembers.added.failed, success: false, error: error.toString() })
            })

        } else {

            TunersModel.findOne({ $or: [{ email: tuner.toLowerCase() }, { phoneNumber: tuner }] }).then((tuner_details) => {
                if (tuner_details) {
                    return res.status(200).json({ message: crewMembers.added.exists, success: false })
                }

                if (eventId) {
                    TunersEventModel.findOne({ _id: eventId, toDate: { $gte: moment().utc().format() } }).populate('name').then((event_details) => {
                        if (!event_details) {
                            return res.status(400).json({ message: crewMembers.added.eventNotFound, success: false })
                        }
                        CrewMembersModel.findOne({ creator: tunersDetails._id, eventId: eventId, memberDetails: tuner, $or: [{ status: 'accepted' }, { status: 'pending' }, { expire: { $lte: moment().utc().format() } }] }).then((details) => {
                            if (details) {
                                return res.status(400).json({ message: crewMembers.added.alreadyInvited, success: false })
                            }
                            CrewMembersModel.create({ creator: tunersDetails._id, eventId, inviteLink: createInvitation(tunersDetails._id, tuner), expire: event_details.toDate, memberDetails: tuner }).then((details) => {
                                res.status(200).json({ message: crewMembers.added.temporary(tuner, event_details.name.name), success: true, data: details })
                            }).catch((error) => {
                                res.status(400).json({ message: crewMembers.added.failed, success: false, error: error.toString() })
                            })
                        })
                    })
                } else {
                    CrewMembersModel.findOne({ creator: tunersDetails._id, eventId: eventId, memberDetails: tuner, $or: [{ status: 'accepted' }, { status: 'pending' }, { expire: { $lte: moment().utc().format() } }] }).then((details) => {
                        if (details) {
                            return res.status(400).json({ message: crewMembers.added.alreadyInvited, success: false })
                        }
                        CrewMembersModel.create({ creator: tunersDetails._id, eventId, inviteLink: createInvitation(tunersDetails._id, tuner), expire: moment().utc().add(5, 'days').format(), memberDetails: tuner }).then((details) => {
                            res.status(200).json({ message: crewMembers.added.permanent(tuner), success: true, data: details })
                        }).catch((error) => {
                            res.status(400).json({ message: crewMembers.added.failed, success: false, error: error.toString() })
                        })
                    })
                }

            }).catch((error) => {
                res.status(400).json({ message: crewMembers.added.failed, success: false, error: error.toString() })
            })
        }

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.acceptInvitation = (req, res) => {
    try {
        const { tunersDetails } = req
        const { invitationLink } = req.body

        verifyInvitation(invitationLink).then((invitation) => {
            let details = invitation.payload

            if (details.creator == tunersDetails.id) {
                return res.status(400).json({ message: crewMembers.accept.owner, success: false })
            }

            if (details.member != tunersDetails.id) {
                return res.status(400).json({ message: crewMembers.accept.notValid, success: false })
            }

            let search = { member: tunersDetails._id, creator: details.creator, status: 'pending', inviteLink: invitationLink, expire: { $gte: moment().utc().format() } }
            let update = { status: 'accepted', inviteLink: null, expire: null }

            TunersModel.findOne({ _id: details.creator, isActive: true }).then((creator) => {
                if (!creator) {
                    return res.status(400).json({ message: crewMembers.accept.notExists, success: false })
                }

                CrewMembersModel.findOneAndUpdate(search, update, { new: true }).populate([{ path: 'creator' }, { path: 'member' }, { path: 'eventId', populate: { path: 'name' } }]).then((details) => {
                    if (!details) {
                        return res.status(400).json({ message: crewMembers.accept.notValid, success: false })
                    }

                    NotificationModel.create({ tuners: details.creator._id, description: details.eventId ? `${details.member.name} has accepted your invitation to join ${details?.eventId?.name?.name}` : `${details.member.name} has accepted your invitation to join your crew`, category: 'crewInvitation', crewInvitation: details._id }).then(() => {
                        NotificationModel.create({ tuners: details.member._id, description: details.eventId ? `You have joined ${details.creator.name}'s Event ${details?.eventId?.name?.name}` : `You have joined ${details.creator.name}'s crew`, category: 'crewInvitation', crewInvitation: details._id }).then(() => {
                            res.status(200).json({ message: crewMembers.accept.success(creator.name), success: true, data: details })
                        }).catch((error) => {
                            res.status(200).json({ message: crewMembers.accept.success(creator.name), success: true, data: details })
                        })
                    }).catch((error) => {
                        res.status(200).json({ message: crewMembers.accept.success(creator.name), success: true, data: details })
                    })

                }).catch((err) => {
                    res.status(400).json({ message: crewMembers.accept.failed, success: false, error: err.toString() })
                })
            }).catch((err) => {
                res.status(400).json({ message: crewMembers.accept.failed, success: false, error: err.toString() })
            })

        }).catch((error) => {
            res.status(400).json({ message: crewMembers.accept.notfound, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.resendInvitation = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { memberShipId } = req.params

        const memberDetails = await CrewMembersModel.findOne({ creator: tunersDetails._id, _id: memberShipId, })

        if (!memberDetails) {
            return res.status(400).json({ message: crewMembers.resend.notfound, success: false })
        }

        if (memberDetails.status == 'accepted') {
            return res.status(400).json({ message: crewMembers.resend.joined, success: false })
        }

        if (memberDetails.status == 'declined') {
            return res.status(400).json({ message: crewMembers.resend.decline, success: false })
        }

        if (!memberDetails.eventId) {
            memberDetails.expire = moment().utc().add(5, 'days').format()
        }

        memberDetails.inviteLink = createInvitation(tunersDetails._id, memberDetails.member || memberDetails.memberDetails)

        memberDetails.save().then((details) => {
            if (memberDetails.member) {
                NotificationModel.findOneAndUpdate({ crewInvitation: details._id }, { isDeleted: false }, { new: true }).then(() => {
                    NotificationModel.create({ tuners: memberDetails.member, description: `You get a invitation from ${tunersDetails.name} to join the team`, category: 'crewInvitation', crewInvitation: details._id }).then(() => {
                        res.status(200).json({ message: crewMembers.resend.success, success: true, data: details })
                    })
                })
            } else {
                res.status(200).json({ message: crewMembers.resend.success, success: true, data: details })
            }

        }).catch((err) => {
            res.status(400).json({ message: crewMembers.resend.failed, success: false, error: err.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.declineInvitation = (req, res) => {
    try {
        const { tunersDetails } = req
        const { invitationLink } = req.body

        verifyInvitation(invitationLink).then((invitation) => {
            let details = invitation.payload

            if (details.creator == tunersDetails.id) {
                return res.status(400).json({ message: crewMembers.decline.owner, success: false })
            }

            if (details.member != tunersDetails.id) {
                return res.status(400).json({ message: crewMembers.decline.notValid, success: false })
            }

            let search = { member: tunersDetails._id, creator: details.creator, status: 'pending', inviteLink: invitationLink, expire: { $gte: moment().utc().format() } }
            let update = { status: 'declined', inviteLink: null, expire: null }

            TunersModel.findOne({ _id: details.creator, isActive: true }).then((creator) => {
                if (!creator) {
                    return res.status(400).json({ message: crewMembers.decline.notExists, success: false })
                }

                CrewMembersModel.findOneAndUpdate(search, update, { new: true }).populate([{ path: 'creator' }, { path: 'member' }, { path: 'eventId', populate: { path: 'name' } }]).then((details) => {
                    if (!details) {
                        return res.status(400).json({ message: crewMembers.decline.notValid, success: false })
                    }

                    NotificationModel.create({ tuners: details.creator._id, description: details.eventId ? `${details.member.name} has declined your invitation to join ${details?.eventId?.name?.name}` : `${details.member.name} has declined your invitation to join your crew`, category: 'crewInvitation', crewInvitation: details._id }).then(() => {
                        NotificationModel.create({ tuners: details.member._id, description: details.eventId ? `You have declined the invitation from ${details.creator.name} to join the ${details?.eventId?.name?.name}` : `You have declined the invitation from ${details.creator.name} to join their Crew`, category: 'crewInvitation', crewInvitation: details._id }).then(() => {
                            res.status(200).json({ message: crewMembers.decline.success(creator.name), success: true, data: details })
                        }).catch((error) => {
                            res.status(200).json({ message: crewMembers.decline.success(creator.name), success: true, data: details })
                        })
                    }).catch((error) => {
                        res.status(200).json({ message: crewMembers.decline.success(creator.name), success: true, data: details })
                    })

                    res.status(200).json({ message: crewMembers.decline.success(creator.name), success: true, data: details })
                }).catch((err) => {
                    res.status(400).json({ message: crewMembers.decline.failed, success: false, error: err.toString() })
                })
            }).catch((err) => {
                res.status(400).json({ message: crewMembers.decline.failed, success: false, error: err.toString() })
            })

        }).catch((error) => {
            res.status(400).json({ message: crewMembers.decline.notfound, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.removeMembers = (req, res) => {
    try {
        const { tunersDetails } = req
        const { memberShipId } = req.params

        CrewMembersModel.findOneAndUpdate({ creator: tunersDetails._id, _id: memberShipId }, { isDeleted: true }, { new: true }).populate('member').then((details) => {
            if (!details) {
                return res.status(400).json({ message: crewMembers.remove.notfound, success: false })
            }
            res.status(200).json({ message: crewMembers.remove.success(details.member?.name), success: true, data: details })
        }).catch((err) => {
            res.status(400).json({ message: crewMembers.remove.failed, success: false, error: err.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getMembers = (req, res) => {
    try {
        const { tunersDetails } = req
        const { eventId, status } = req.query

        const request = { creator: tunersDetails._id, eventId: null }

        if (status) {
            Object.assign(request, { status })
        }

        if (eventId) {
            Object.assign(request, { eventId })
        }

        CrewMembersModel.find(request, { member: 1, status: 1, memberDetails: 1 }).populate({ path: 'member', populate: [{ path: 'gender', select: 'name' }, { path: 'designation', select: 'name' }, { path: 'specialization.vehicleType', select: 'type name' }, { path: 'specialization.category', select: 'name' }] }).then((details) => {
            res.status(200).json({ message: crewMembers.getMembers.success, success: true, data: details })
        }).catch((err) => {
            res.status(400).json({ message: crewMembers.getMembers.failed, success: false, error: err.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleMember = (req, res) => {
    try {
        const { tunersDetails } = req
        const { memberShipId } = req.params

        CrewMembersModel.findOne({ creator: tunersDetails._id, _id: memberShipId }, { member: 1, status: 1, memberDetails: 1 }).populate({ path: 'member', populate: [{ path: 'designation', select: 'name' }, { path: 'specialization.vehicleType', select: 'type name' }, { path: 'specialization.category', select: 'name' }] }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: crewMembers.getSingleMember.notfound, success: false })
            }
            res.status(200).json({ message: crewMembers.getSingleMember.success, success: true, data: details })
        }).catch((err) => {
            res.status(400).json({ message: crewMembers.getSingleMember.failed, success: false, error: err.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.searchMembers = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { search } = req.query

        const crewId = await CrewMembersModel.find({ creator: tunersDetails._id, $or: [{ status: 'accepted' }, { status: 'pending' }, { expire: { $lte: moment().utc().format() } }] }, { member: 1, _id: 0 })

        let crewIds = []
        if (crewId.length > 0) {
            crewIds = await crewId.map((crew) => (crew.member))
        }

        TunersModel.find({
            isActive: true,
            $and: [{ _id: { $nin: crewIds } }, { _id: { $ne: tunersDetails._id }, }],
            $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { mobile: { $regex: search, $options: 'i' } }]
        }).populate([
            { path: 'designation', select: 'name' },
            { path: 'specialization.vehicleType', select: 'type name' },
            { path: 'specialization.category', select: 'name' }
        ]).then((result) => {
            res.status(200).json({ message: crewMembers.searchMembers.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: crewMembers.searchMembers.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.searchMyMembers = async (req, res) => {
    try {
        const { tunersDetails } = req
        const { search, eventId } = req.query

        let request = { creator: tunersDetails._id, status: 'accepted', }

        if (eventId) {
            Object.assign(request, { $or: [{ eventId: null }, { eventId }] })
        } else {
            Object.assign(request, { eventId: null })
        }

        const crewId = await CrewMembersModel.find(request, { member: 1, _id: 0 })

        let crewIds = []
        if (crewId.length > 0) {
            crewIds = await crewId.map((crew) => (crew.member))
        }

        TunersModel.find({
            isActive: true,
            $and: [{ _id: { $in: crewIds } }, { _id: { $ne: tunersDetails._id }, }],
            $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { mobile: { $regex: search, $options: 'i' } }]
        }).populate([
            { path: 'designation', select: 'name' },
            { path: 'specialization.vehicleType', select: 'type name' },
            { path: 'specialization.category', select: 'name' }
        ]).then((result) => {
            res.status(200).json({ message: crewMembers.searchMembers.success, success: true, data: result })
        }).catch((error) => {
            res.status(400).json({ message: crewMembers.searchMembers.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getAllTeam = async (req, res) => {
    try {
        const { tunersDetails } = req

        const crewId = await CrewMembersModel.find({ member: tunersDetails._id }, { creator: 1 })

        TunersModel.find({ _id: { $in: crewId.map((element) => element.creator) } }, { password: 0, resetPasswordCode: 0, resetPasswordAt: 0, specialization: 0 }).populate('designation gender').then((details) => {
            res.status(200).json({ message: crewMembers.getAllTeam.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: crewMembers.getAllTeam.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}