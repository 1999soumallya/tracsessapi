const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizers',
        required: true
    },
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'eventnames',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    fromDate: {
        type: Date,
    },
    toDate: {
        type: Date,
    },
    date: {
        type: Date,
    },
    location: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    allowCarryForward: {
        type: Boolean,
        required: true
    },
    carryForwarded: {
        type: Boolean
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isCanceled: {
        type: Boolean,
        default: false
    },
    sessions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sessions'
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

eventSchema.virtual("bookings", {
    localField: "_id",
    foreignField: "event",
    ref: "books",
    match: { isDeleted: false }
})

eventSchema.set('toJSON', { virtuals: true })
eventSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('events', eventSchema)