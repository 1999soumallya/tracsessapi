const mongoose = require('mongoose');

const SessionSetup = new mongoose.Schema({
    tuner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tuners',
        required: true
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'sessions',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    alias: {
        type: String
    },
    trackCondition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trackConditions'
    },
    weather: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'weathers'
    },
    temperature: {
        track: {
            type: Number,
        },
        ambient: {
            type: String,
        }
    },
    wind: {
        speed: {
            type: Number,
        },
        direction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'directions'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

SessionSetup.pre('save', function (next) {
    this.alias = this.name.replaceAll(/\s/g, '-').toLowerCase();
    next()
})

SessionSetup.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

SessionSetup.pre('aggregate', function (next) {
    this.match({ isDeleted: false })
    this.project('-isDeleted')
    next()
})

SessionSetup.pre('find', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

SessionSetup.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

SessionSetup.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

SessionSetup.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

SessionSetup.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

SessionSetup.virtual('riderGroup', {
    ref: 'setupRiders',
    localField: '_id',
    foreignField: 'sessionSetupId',
    match: { isDeleted: false }
})

SessionSetup.set('toJSON', { virtuals: true })
SessionSetup.set('toObject', { virtuals: true })

module.exports = mongoose.model('sessionSetups', SessionSetup)