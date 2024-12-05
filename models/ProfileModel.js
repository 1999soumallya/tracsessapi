const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizers'
    },
    managingTrack: {
        type: Boolean
    },
    track: {
        name: String,
        location: String,
        address: String,
        image: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

profileSchema.pre('find', function (next) {
    this.select('-isDeleted')
    next()
})

profileSchema.pre('findOne', function (next) {
    this.select('-isDeleted')
    next()
})

module.exports = mongoose.model("profiles", profileSchema)