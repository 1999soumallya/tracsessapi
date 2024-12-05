const { default: mongoose } = require("mongoose");

const tunersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true,
        default: '+91'
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    gender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'genders',
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
    emergencyContact: {
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        relationship: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'relations',
        }
    },
    designation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'designations',
    },
    specialization: [
        {
            vehicleType: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'vehicleTypes',
            },
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'specializationCategories',
            }
        }
    ],
    isActive: {
        type: Boolean,
        default: false
    },
    needSync: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

tunersSchema.index({ mobile: 1, countryCode: 1 }, { unique: true })
tunersSchema.index({ email: 1 }, { unique: true })

tunersSchema.virtual('crewMembers', {
    localField: '_id',
    foreignField: 'creator',
    ref: 'crewMembers',
})

tunersSchema.virtual('paramentCrewParticipant', {
    localField: '_id',
    foreignField: 'member',
    ref: 'crewMembers',
    match: { eventId: null, status: 'accepted' }
})

tunersSchema.virtual('temporaryCrewParticipant', {
    localField: '_id',
    foreignField: 'member',
    ref: 'crewMembers',
    match: { eventId: { $ne: null }, status: 'accepted' }
})

tunersSchema.virtual('riders', {
    localField: '_id',
    foreignField: 'creator',
    ref: 'tunerRiders',
})

tunersSchema.pre('aggregate', function (next) {
    this.where({ isDeleted: false })
    next()
})

tunersSchema.pre('find', function (next) {
    this.where({ isDeleted: false })
    next()
})

tunersSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    next()
})

tunersSchema.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    next()
})

tunersSchema.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    next()
})

tunersSchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    next()
})

tunersSchema.set('toJSON', { virtuals: true })
tunersSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('tuners', tunersSchema)