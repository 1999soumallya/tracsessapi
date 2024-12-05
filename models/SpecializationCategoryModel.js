const { default: mongoose } = require("mongoose");

const Specialization = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    alias: {
        type: String
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

Specialization.index({ name: 1 }, { unique: true })

Specialization.virtual("tuners", {
    localField: "_id",
    foreignField: "specialization.category",
    ref: "tuners",
    match: { isDeleted: false }
})

Specialization.pre('save', function (next) {
    this.alias = this.name.replaceAll(/\s/g, '')
    next()
})

Specialization.pre('aggregate', function (next) {
    this.where({ isDeleted: false })
    next()
})

Specialization.pre('find', function (next) {
    this.where({ isDeleted: false })
    next()
})

Specialization.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    next()
})

Specialization.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    next()
})

Specialization.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    next()
})

Specialization.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    next()
})

Specialization.set('toJSON', { virtuals: true })
Specialization.set('toObject', { virtuals: true })

module.exports = mongoose.model('specializationCategories', Specialization)