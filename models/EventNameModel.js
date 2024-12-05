const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    alias: {
        type: String
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizers'
    },
    tuner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tuners',
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

EventSchema.virtual("events", {
    localField: "_id",
    foreignField: "name",
    ref: "events"
})

EventSchema.pre('save', function (next) {
    this.alias = this.name.replaceAll(/\s/g, '').toLowerCase();
    next()
})

EventSchema.index({ name: 1, organizer: 1 }, { unique: true })
EventSchema.set('toJSON', { virtuals: true })
EventSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('eventnames', EventSchema)