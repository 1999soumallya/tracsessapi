const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tunerevents'
    },
    name: {
        type: String,
        required: true
    },
    fromTime: {
        type: Date,
        required: true
    },
    toTime: {
        type: Date,
        required: true
    },
    vehicleTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicleTypes",
        required: true,
    },
    vehicleCategory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'vehicleCategories'
        }
    ],
    sameAsSession: {
        type: String
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

SessionSchema.virtual('events', {
    localField: '_id',
    foreignField: 'sessions',
    ref: 'events',
    justOne: true,
    match: { isDeleted: false }
})

SessionSchema.virtual('setups', {
    localField: '_id',
    foreignField: 'session',
    ref: 'sessionSetups',
    match: { isDeleted: false }
})

SessionSchema.virtual("bookings", {
    localField: "_id",
    foreignField: "session",
    ref: "books",
    match: { isDeleted: false }
})

// SessionSchema.index({ name: 1, events: 1, isDeleted: false }, { unique: true })
SessionSchema.set('toJSON', { virtuals: true })
SessionSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('sessions', SessionSchema)