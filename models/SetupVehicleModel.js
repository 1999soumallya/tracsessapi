const mongoose = require('mongoose');

const SetupRiderModel = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vehicles'
    },
    crewMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tuners'
        }
    ],
    setups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'vehiclesetups'
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false
    }
})

SetupRiderModel.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

SetupRiderModel.pre('find', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

SetupRiderModel.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

SetupRiderModel.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

SetupRiderModel.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

SetupRiderModel.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

module.exports = mongoose.model('sessionvehicles', SetupRiderModel)