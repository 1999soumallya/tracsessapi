const { default: mongoose } = require("mongoose");

const bookedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events',
        required: true
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sessions',
        required: true
    },
    vehicleCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vehicleCategories'
    },
    vehiclesBooked: [
        {
            vehicleId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'vehicles'
            },
            duration: {
                hours: {
                    type: String
                },
                minutes: {
                    type: String
                }
            },
        }
    ],
    isCanceled: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

// bookedSchema.index({ event: 1, session: 1, vehicleCategory: 1, user: 1, isDeleted: false, isCanceled: false }, { unique: true })

module.exports = mongoose.model('books', bookedSchema)