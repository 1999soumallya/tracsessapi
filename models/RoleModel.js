const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    tuners: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tuners'
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizers'
    },
    name: {
        type: String,
        required: true
    },
    alias: {
        type: String
    },
    platform: {
        type: String,
        enum: ['admin', 'organizer', 'tuners']
    },
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'permissions',
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

RoleSchema.pre('save', function (next) {
    this.alias = this.name.replace(/\s/g, '-').toLowerCase();
    next()
})

RoleSchema.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

RoleSchema.pre('find', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

RoleSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

RoleSchema.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

RoleSchema.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

RoleSchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

RoleSchema.set('toJSON', { virtuals: true })
RoleSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('roles', RoleSchema)