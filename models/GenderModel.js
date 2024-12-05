const { default: mongoose } = require("mongoose");

const GenderSchema = new mongoose.Schema({
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

GenderSchema.pre('save', function (next) {
    this.alias = this.name.replaceAll(/\s/g, '-').toLowerCase();
    next()
})

GenderSchema.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    next()
})

GenderSchema.pre('aggregate', function (next) {
    this.where({ isDeleted: false })
    next()
})

GenderSchema.pre('find', function (next) {
    this.where({ isDeleted: false })
    next()
})

GenderSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    next()
})

GenderSchema.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    next()
})

GenderSchema.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    next()
})

GenderSchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    next()
})

GenderSchema.set('toJSON', { virtuals: true })
GenderSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model("genders", GenderSchema);