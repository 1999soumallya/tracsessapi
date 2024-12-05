const mongoose = require('mongoose');

const TunerEventSchema = new mongoose.Schema({
    tuner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tuners',
        required: true
    },
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'eventnames',
        required: true
    },
    image: {
        type: String
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    track: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tracks',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isCanceled: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

TunerEventSchema.virtual('sessions', {
    localField: '_id',
    foreignField: 'event',
    ref: 'sessions',
    match: { isDeleted: false }
})

TunerEventSchema.virtual('riders', {
    localField: '_id',
    foreignField: 'event',
    ref: 'riders',
    match: { isDeleted: false }
})

TunerEventSchema.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

TunerEventSchema.pre('find', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

TunerEventSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

TunerEventSchema.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

TunerEventSchema.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

TunerEventSchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

TunerEventSchema.set('toJSON', { virtuals: true })
TunerEventSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model("tunerevents", TunerEventSchema)