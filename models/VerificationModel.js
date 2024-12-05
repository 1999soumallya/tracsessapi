const { default: mongoose } = require("mongoose");

const verificationSchema = new mongoose.Schema({
    email: {
        type: String
    },
    countryCode: {
        type: String,
        default: '+91'
    },
    mobile: {
        type: String
    },
    verification: {
        type: Number,
        required: true,
        unique: true
    },
    expired: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('verification', verificationSchema)