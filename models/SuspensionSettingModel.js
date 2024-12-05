const mongoose = require('mongoose');

const SuspensionSettingSchema = new mongoose.Schema({
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
})

SuspensionSettingSchema.pre("save", function (next) {
    this.alias = this.name.replace(/\s/g, '-').toLowerCase();
    next()
})

SuspensionSettingSchema.pre("find", function (next) {
    this.where({ isDeleted: false })
    next()
})

SuspensionSettingSchema.pre("findOne", function (next) {
    this.where({ isDeleted: false })
    next()
})

SuspensionSettingSchema.pre("aggregate", function (next) {
    this.where({ isDeleted: false })
    next()
})

SuspensionSettingSchema.pre("countDocuments", function (next) {
    this.where({ isDeleted: false })
    next()
})

SuspensionSettingSchema.pre("findOneAndDelete", function (next) {
    this.where({ isDeleted: false })
    next()
})

SuspensionSettingSchema.pre("findOneAndReplace", function (next) {
    this.where({ isDeleted: false })
    next()
})

SuspensionSettingSchema.pre("findOneAndUpdate", function (next) {
    this.where({ isDeleted: false })
    next()
})

module.exports = mongoose.model('suspensionsettings', SuspensionSettingSchema);