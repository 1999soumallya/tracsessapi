const { default: mongoose } = require("mongoose")

const vehicleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizers'
    },
    CC: {
        type: Number,
    },
    vehicleSource: {
        type: String,
        enum: ['ORG', 'OWN'],
        required: true,
    },
    vehicleType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicleTypes",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    nickname: {
        type: String,
    },
    registrationNumber: {
        type: String,
    },
    racingNumber: {
        type: String,
    },
    chassisNumber: {
        type: String,
    },
    engineNumber: {
        type: String,
    }
}, { timestamps: true })

vehicleSchema.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

vehicleSchema.pre('find', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

vehicleSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

vehicleSchema.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

vehicleSchema.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

vehicleSchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})


vehicleSchema.virtual("bookings", {
    localField: "_id",
    foreignField: "vehiclesBooked.vehicleId",
    ref: "books",
    match: { isDeleted: false }
})

vehicleSchema.virtual("vehicleCategories", {
    localField: "_id",
    foreignField: "organizerVehicleId",
    ref: "vehicleCategories",
    match: { isDeleted: false }
})

vehicleSchema.set('toJSON', { virtuals: true, getters: true })
vehicleSchema.set('toObject', { virtuals: true, getters: true })

module.exports = mongoose.model('vehicles', vehicleSchema)