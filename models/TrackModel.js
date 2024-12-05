const { default: mongoose } = require("mongoose");

const TrackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    alias: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

TrackSchema.pre('save', function (next) {
    this.alias = this.name.replaceAll(/\s/g, '-').toLowerCase();
    next()
})

TrackSchema.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    next()
})

TrackSchema.pre('aggregate', function (next) {
    this.where({ isDeleted: false })
    next()
})

TrackSchema.pre('find', function (next) {
    this.where({ isDeleted: false })
    next()
})

TrackSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    next()
})

TrackSchema.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    next()
})

TrackSchema.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    next()
})

TrackSchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    next()
})

TrackSchema.set('toJSON', { virtuals: true })
TrackSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model("tracks", TrackSchema);