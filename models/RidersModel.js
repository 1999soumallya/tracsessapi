const { default: mongoose } = require("mongoose");

const riders = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tuners',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tunerevents',
        required: true
    },
    inviteLink: {
        type: String,
        required: true
    },
    expire: {
        type: Date,
        required: true
    },
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    riderDetails: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

riders.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    next()
})

riders.pre('aggregate', function (next) {
    this.where({ isDeleted: false })
    next()
})

riders.pre('find', function (next) {
    this.where({ isDeleted: false })
    next()
})

riders.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    next()
})

riders.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    next()
})

riders.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    next()
})

riders.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    next()
})

riders.pre('updateOne', function (next) {
    this.where({ isDeleted: false })
    next()
})

riders.pre('updateMany', function (next) {
    this.where({ isDeleted: false })
    next()
})

riders.set('toJSON', { virtuals: true })
riders.set('toObject', { virtuals: true })

module.exports = mongoose.model("tunerRiders", riders)