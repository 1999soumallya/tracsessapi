const mongoose = require("mongoose")

const VehicleTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

VehicleTypeSchema.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

VehicleTypeSchema.pre('find', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

VehicleTypeSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

VehicleTypeSchema.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

VehicleTypeSchema.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

VehicleTypeSchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

VehicleTypeSchema.virtual("vechiles", {
    localField: '_id',
    foreignField: 'type',
    ref: 'vehicles',
    match: { isDeleted: false }
})

VehicleTypeSchema.set("toJSON", { virtuals: true })
VehicleTypeSchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("vehicleTypes", VehicleTypeSchema)