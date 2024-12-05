const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
        code: {
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
    isActive: {
        type: Boolean,
        default: true
    },
    activation: {
        code: {
            type: Number,
        },
        expired: {
            type: Date
        }
    },

    image: {
        type: String
    },
    location: {
        type: String,
        required: true,
    },
    weightFullGear: {
        type: Number
    },
    needSync: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

userSchema.index({ phoneNumber: 1, countryCode: 1 }, { unique: true })

userSchema.virtual('vehicles', {
    localField: '_id',
    foreignField: 'user',
    ref: 'vehicles',
    match: { isDeleted: false }
})

userSchema.virtual('bookings', {
    localField: '_id',
    foreignField: 'user',
    ref: 'books',
    match: { isDeleted: false }
})

userSchema.virtual('profile', {
    localField: '_id',
    foreignField: 'user',
    ref: 'profiles',
    justOne: true
})

userSchema.set('toJSON', { virtuals: true })
userSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('users', userSchema)