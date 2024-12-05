const { default: mongoose } = require("mongoose");

const crewMembers = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tuners',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tunerevents'
    },
    inviteLink: {
        type: String,
        required: true
    },
    expire: {
        type: Date,
        required: true
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tuners'
    },
    memberDetails: {
        type: String
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

crewMembers.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    next()
})

crewMembers.pre('aggregate', function (next) {
    this.where({ isDeleted: false })
    next()
})

crewMembers.pre('find', function (next) {
    this.where({ isDeleted: false })
    next()
})

crewMembers.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    next()
})

crewMembers.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    next()
})

crewMembers.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    next()
})

crewMembers.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    next()
})

crewMembers.set('toJSON', { virtuals: true })
crewMembers.set('toObject', { virtuals: true })

module.exports = mongoose.model("crewMembers", crewMembers)