const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    tuners: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tuners'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['crewInvitation', 'riderInvitation'],
        required: true
    },
    crewInvitation: {
        type: mongoose.Types.ObjectId,
        ref: 'crewMembers',
    },
    riderInvitation: {
        type: mongoose.Types.ObjectId,
        ref: 'tunerRiders',
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

NotificationSchema.pre('aggregate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

NotificationSchema.pre('find', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

NotificationSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

NotificationSchema.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

NotificationSchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

NotificationSchema.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

NotificationSchema.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    next()
})

module.exports = mongoose.model('notifications', NotificationSchema)