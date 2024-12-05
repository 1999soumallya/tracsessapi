const mongoose = require("mongoose")

const PeriodSchima = new mongoose.Schema({
    name: {
        type: String,
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
    dependentfields: {
        type: Array,
        default: []
    }
}, { timestamps: true })

PeriodSchima.virtual("vechileCategorys", {
    localField: "_id",
    foreignField: "period",
    ref: "vehicleCategories",
    match: { isDeleted: false }
})

PeriodSchima.set("toJSON", { virtuals: true })
PeriodSchima.set("toObject", { virtuals: true })

module.exports = mongoose.model("periods", PeriodSchima)