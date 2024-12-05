const moment = require("moment-timezone");
const EventModel = require("../models/EventModel");
const VehiclesModel = require("../models/VehiclesModel");
const CommonMessage = require("./CommonMessage");

exports.validateBookingRequest = (event, sessionDetails, userdetails) => {
    let vehicleCategoryArray = []

    return new Promise((resolve, reject) => {
        EventModel.findOne({ _id: event, isDeleted: false, isActive: true, isCanceled: false, fromDate: { $gte: moment().startOf("day").format() } }).populate([
            {
                path: "sessions",
                match: {
                    isDeleted: false,
                    isCanceled: false,
                    isActive: true
                },
                populate: {
                    path: "vehicleCategory",
                    match: {
                        isDeleted: false,
                        isCanceled: false,
                        isActive: true
                    },
                    populate: {
                        path: "period.periodid"
                    }
                }
            }]).then(async (eventdetails) => {
                if (!eventdetails) {
                    return reject({ message: CommonMessage.bookEvent.noevent, success: false })
                }

                // This for loop for checking session
                for (let i = 0; i < sessionDetails.length; i++) {
                    const element1 = sessionDetails[i];
                    let sessionObject = eventdetails.sessions.find((item) => item._id == element1.session)

                    if (!sessionObject) {
                        return reject({ message: CommonMessage.bookEvent.nosessiong(element1.session), success: false })
                    }

                    let endTime = moment(moment(eventdetails.toDate).format('YYYY-MM-DD') + ' ' + sessionObject.toTime).format()

                    if (!moment().isSameOrBefore(endTime)) {
                        return reject({ message: CommonMessage.bookEvent.notcurrent(sessionObject.name), success: false })

                    } else {
                        // This for loop for checking vehicleCategory
                        for (let j = 0; j < element1.vehicleDetails.length; j++) {
                            const element2 = element1.vehicleDetails[j];
                            let vehicleCategoryObject = sessionObject.vehicleCategory.find((item) => item._id == element2.vehicleCategoryId)

                            if (!vehicleCategoryObject) {
                                return reject({ message: CommonMessage.bookEvent.notvehiclecategory(element2.vehicleCategoryId, sessionObject.name), success: false })
                            }

                            if (vehicleCategoryObject.bookedSlots == vehicleCategoryObject.slots) {
                                return reject({ message: CommonMessage.bookEvent.noslot(vehicleCategoryObject?.name), success: false })
                            }

                            // This for loop for checking vehicle
                            for (let k = 0; k < element2.selectedVehicles.length; k++) {
                                const element3 = element2.selectedVehicles[k];
                                if (!vehicleCategoryObject.period) {
                                    return reject({
                                        message: `Period is not found for ${vehicleCategoryObject?.name} vehicle category`,
                                        success: false
                                    })
                                }

                                if (vehicleCategoryObject.slots == vehicleCategoryObject.bookedSlots) {
                                    return reject({
                                        message: `${vehicleCategoryObject?.name} vehicle category is already full can not book this vehicle category`,
                                        success: false
                                    })
                                }

                                if (vehicleCategoryObject.period.periodid.dependentfields.length > 0) {
                                    if (!element3.duration) {
                                        return reject({ message: CommonMessage.bookEvent.duration(element2.vehicleCategoryId), success: false })
                                    }

                                    // else {
                                    //     if (Object.keys(element3.duration).length != vehicleCategoryObject.period.periodid.dependentfields.length) {
                                    //         return reject({
                                    //             message: `Provide ${vehicleCategoryObject.period.periodid.dependentfields.toString()} fields for booked this event`,
                                    //             success: false
                                    //         })
                                    //     } else {
                                    //         for (let index = 0; index < vehicleCategoryObject.period.periodid.dependentfields.length; index++) {
                                    //             const dependentfields = vehicleCategoryObject.period.periodid.dependentfields[index];
                                    //             if (!Object.keys(element3.duration).includes(dependentfields)) {
                                    //                 return reject({
                                    //                     message: `Provide only ${dependentfields} field for booked this event`,
                                    //                     success: false
                                    //                 })
                                    //             }
                                    //         }
                                    //     }
                                    // }
                                } else {
                                    if (element3.duration) {
                                        return reject({ message: "Remove the duraction field for book this event", success: false })
                                    }
                                }

                                let findObject = { isDeleted: false, isActive: true, _id: element3.vehicleId, vehicleType: sessionObject.vehicleTypeId, vehicleSource: vehicleCategoryObject.vehicleSource }
                                if (vehicleCategoryObject.vehicleSource == 'OWN') {
                                    Object.assign(findObject, { user: userdetails._id })
                                }

                                await VehiclesModel.findOne(findObject).then((vehicleDetails) => {
                                    if (!vehicleDetails) {
                                        return reject({ message: CommonMessage.bookEvent.notsuooprtedvehicle(element3.vehicleId, sessionObject.name), success: false })
                                    }
                                })

                            }

                            vehicleCategoryArray.push(vehicleCategoryObject._id)
                        }
                    }

                    if (i == (sessionDetails.length - 1)) {
                        resolve(vehicleCategoryArray)
                    }
                }


            }).catch((error) => {
                reject({ message: CommonMessage.bookEvent.requestvalidatefailed, success: false, error: error.stack })
            })
    })
}