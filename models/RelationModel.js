const { default: mongoose } = require("mongoose");

const RelationSchema = new mongoose.Schema({
    relation: {
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

RelationSchema.pre('save', function (next) {
    this.alias = this.relation.replaceAll(/\s/g, '-').toLowerCase();
    next()
})

RelationSchema.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    next()
})

RelationSchema.pre('aggregate', function (next) {
    this.where({ isDeleted: false })
    next()
})

RelationSchema.pre('find', function (next) {
    this.where({ isDeleted: false })
    next()
})

RelationSchema.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    next()
})

RelationSchema.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    next()
})

RelationSchema.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    next()
})

RelationSchema.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    next()
})

RelationSchema.set('toJSON', { virtuals: true })
RelationSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model("relations", RelationSchema)