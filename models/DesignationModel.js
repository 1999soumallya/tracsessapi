const { default: mongoose } = require("mongoose");

const designation = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    alias: {
        type: String
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

designation.index({ name: 1 }, { unique: true })

designation.virtual('tuners', {
    localField: '_id',
    foreignField: 'designation',
    ref: 'tuners',
    match: { isDeleted: false }
})

designation.pre('save', function (next) {
    this.alias = this.name.replaceAll(/\s/g, '')
    next()
})

designation.pre('aggregate', function (next) {
    this.where({ isDeleted: false })
    next()
})

designation.pre('find', function (next) {
    this.where({ isDeleted: false })
    next()
})

designation.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    next()
})

designation.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    next()
})

designation.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    next()
})

designation.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    next()
})

designation.set('toJSON', { virtuals: true })
designation.set('toObject', { virtuals: true })

module.exports = mongoose.model('designations', designation)