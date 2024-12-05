const mongoose = require('mongoose')

const vehicleCategorySchema = new mongoose.Schema({
    name: {
        type: String
    },
    organizerVehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vehicles'
    },
    vehicleSource: {
        type: String,
        enum: ['ORG', 'OWN'],
        required: true,
    },
    fromCC: {
        type: Number,
    },
    toCC: {
        type: Number
    },
    CC: {
        type: Number
    },
    slots: {
        type: Number,
        default: 0
    },
    bookedSlots: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    period: {
        periodid: {            
            type: mongoose.Schema.Types.ObjectId,
            ref: 'periods',
            required: true
        },
        dependentfields: {
            type: Object
        }
    },
    duration: {
        hours: {
            type: Number
        },
        minutes: {
            type: Number
        },
    },
    maxAllowedDuration: {
        hours: {
            type: Number
        },
        minutes: {
            type: Number
        },
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

vehicleCategorySchema.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

vehicleCategorySchema.pre('find', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

vehicleCategorySchema.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

vehicleCategorySchema.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

vehicleCategorySchema.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

vehicleCategorySchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

vehicleCategorySchema.virtual('sessions', {
    localField: '_id',
    foreignField: 'vehicleCategory',
    ref: 'sessions',
    match: { isDeleted: false }
})

vehicleCategorySchema.virtual("bookings", {
    localField: "_id",
    foreignField: "vehicleCategory",
    ref: "books",
    match: { isDeleted: false }
})

vehicleCategorySchema.set('toJSON', { virtuals: true })
vehicleCategorySchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('vehicleCategories', vehicleCategorySchema)