const { default: mongoose } = require("mongoose");

const ImagesSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    imagePatch: {
        type: String,
        required: true
    },
    track: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tracks'
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events'
    },
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    tuners: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tuners'
    },
    organizers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizers'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model("images", ImagesSchema)