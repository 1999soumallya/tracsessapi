const mongoose = require('mongoose')

const TrackCondition = new mongoose.Schema({
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
})

TrackCondition.pre('save', function (next) {
    this.alias = this.name.replaceAll(/\s/g, '-').toLowerCase();
    next()
})

TrackCondition.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

TrackCondition.pre('aggregate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

TrackCondition.pre('find', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

TrackCondition.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

TrackCondition.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

TrackCondition.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

TrackCondition.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

module.exports = mongoose.model('trackConditions', TrackCondition)