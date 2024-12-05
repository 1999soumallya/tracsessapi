const { default: mongoose } = require("mongoose");

const setupRidersSchema = new mongoose.Schema({
    sessionSetupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sessionSetups'
    },
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    vehicleDetails: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sessionvehicles'
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false
    }
})

setupRidersSchema.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

setupRidersSchema.pre('find', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

setupRidersSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

setupRidersSchema.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

setupRidersSchema.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

setupRidersSchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

module.exports = mongoose.model('setupRiders', setupRidersSchema)