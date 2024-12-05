const mongoose = require('mongoose');

const VehicleSetupModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    alias: {
        type: String
    },
    tyre: {
        front: {
            pressure: {
                cold: {
                    type: Number
                },
                hot: {
                    type: Number,
                }
            },
            temperature: {
                type: Number,
            }
        },
        rear: {
            pressure: {
                cold: {
                    type: Number,
                },
                hot: {
                    type: Number,
                }
            },
            temperature: {
                type: Number,
            }
        }
    },
    suspension: {
        sag: {
            front: {
                type: Number,
            },
            rear: {
                type: Number,
            }
        },
        dropHeight: {
            front: {
                type: Number,
            },
            rear: {
                type: Number,
            }
        },
        preload: {
            front: {
                value: {
                    type: Number,
                },
                settings: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'suspensionsettings'
                },
            },
            rear: {
                value: {
                    type: Number,
                },
                settings: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'suspensionsettings'
                },
            }
        },
        compression: {
            front: {
                value: {
                    type: Number,
                },
                settings: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'suspensionsettings'
                },
            },
            rear: {
                value: {
                    type: Number,
                },
                settings: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'suspensionsettings'
                },
            }
        },
        rebound: {
            front: {
                value: {
                    type: Number,
                },
                settings: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'suspensionsettings'
                },
            },
            rear: {
                value: {
                    type: Number,
                },
                settings: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'suspensionsettings'
                },
            }
        },
    },
    sprockets: {
        front: {
            type: Number,
        },
        rear: {
            type: Number,
        }
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

VehicleSetupModel.pre('save', function (next) {
    this.alias = this.name.replace(/\s/g, '-').toLowerCase();
    next()
})

VehicleSetupModel.pre('countDocuments', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

VehicleSetupModel.pre('find', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

VehicleSetupModel.pre('findOne', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

VehicleSetupModel.pre('findOneAndDelete', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

VehicleSetupModel.pre('findOneAndReplace', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

VehicleSetupModel.pre('findOneAndUpdate', function (next) {
    this.where({ isDeleted: false })
    this.select('-isDeleted')
    next()
})

VehicleSetupModel.virtual('laps', {
    ref: 'laps',
    localField: '_id',
    foreignField:'vehicleSetup',
})

VehicleSetupModel.set('toJSON', { virtuals: true })
VehicleSetupModel.set('toObject', { virtuals: true })

module.exports = mongoose.model("vehiclesetups", VehicleSetupModel)