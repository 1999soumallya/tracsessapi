const { default: mongoose } = require("mongoose");

const PermissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    alias: {
        type: String
    },
    module: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    platform: {
        type: String,
        enum: ['admin', 'organizer', 'tuners']
    },
    isRead: {
        type: Boolean,
        required: true
    },
    isWrite: {
        type: Boolean,
        required: true
    },
    isDelete: {
        type: Boolean,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

PermissionSchema.pre('save', function (next) {
    this.alias = this.name.replace(/\s/g, '-').toLowerCase();
    next()
})

PermissionSchema.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

PermissionSchema.pre('find', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

PermissionSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

PermissionSchema.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

PermissionSchema.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

PermissionSchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

PermissionSchema.virtual('roles', {
    foreignField: 'permissions',
    localField: '_id',
    ref: 'roles'
})

PermissionSchema.set('toJSON', { virtuals: true })
PermissionSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model("permissions", PermissionSchema);