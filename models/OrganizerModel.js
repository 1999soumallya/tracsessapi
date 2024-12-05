const { default: mongoose } = require("mongoose");

const OrganizerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    countryCode: {
        type: Number,
        required: true,
        default: 91
    },
    resetPassword: {
        token: {
            type: String
        },
        time: {
            type: Date
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 10
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    }
}, { timestamps: true })

OrganizerSchema.index({ phoneNumber: 1, countryCode: 1 }, { unique: true })

OrganizerSchema.virtual('vehicles', {
    localField: '_id',
    foreignField: 'organizer',
    ref: 'vehicles',
    match: { isDeleted: false }
})

OrganizerSchema.virtual('events', {
    localField: '_id',
    foreignField: 'organizer',
    ref: 'events',
    match: { isDeleted: false }
})

OrganizerSchema.virtual('eventnames', {
    localField: '_id',
    foreignField: 'organizer',
    ref: 'eventnames',
    match: { isDeleted: false }
})

OrganizerSchema.virtual('profile', {
    localField: '_id',
    foreignField: 'organizer',
    ref: 'profiles',
    justOne: true
})

OrganizerSchema.set('toJSON', { virtuals: true })
OrganizerSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('organizers', OrganizerSchema)