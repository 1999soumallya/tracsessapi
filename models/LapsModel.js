const mongoose = require('mongoose')

const LapsSchema = new mongoose.Schema({
    vehicleSetup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vehiclesetups',
        required: true
    },
    lapTiming: {
        type: String,
        required: true
    },
    totalFrames: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

LapsSchema.pre('find', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

LapsSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

LapsSchema.pre('aggregate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

module.exports = mongoose.model('laps', LapsSchema)