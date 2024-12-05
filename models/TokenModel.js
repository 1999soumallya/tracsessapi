const { default: mongoose } = require("mongoose");

const token = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizers'
    },
    tuners: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tuners'
    },
    token: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("tokens", token)