const { specializationCategory, commonError } = require("../helpers/CommonMessage");
const { pagination } = require("../helpers/Helpers");
const SpecializationCategoryModel = require("../models/SpecializationCategoryModel");

exports.createCategory = (req, res) => {
    try {
        const { name, isActive } = req.body;

        SpecializationCategoryModel.create({ name, isActive }).then((details) => {
            res.status(200).json({ message: specializationCategory.create.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: specializationCategory.create.failed, success: false, error: error.toString() })
        })
    }
    catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.updateCategory = (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        SpecializationCategoryModel.findOneAndUpdate({ _id: id }, { name, alias: name.replaceAll(/\s/g, '') }, { new: true }).then((details) => {
            res.status(200).json({ message: specializationCategory.update.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: specializationCategory.update.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.deleteCategory = (req, res) => {
    try {
        const { id } = req.params;

        SpecializationCategoryModel.findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: specializationCategory.delete.notfound, success: false })
            }

            res.status(200).json({ message: specializationCategory.delete.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: specializationCategory.delete.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.toggleCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const details = await SpecializationCategoryModel.findOne({ _id: id })

        if (!details) {
            return res.status(400).json({ message: specializationCategory.toggle.notfound, success: false })
        }

        SpecializationCategoryModel.findOneAndUpdate({ _id: id }, { isActive: !details.isActive }, { new: true }).then((newDetails) => {
            res.status(200).json({ message: newDetails.isActive ? specializationCategory.toggle.active : specializationCategory.toggle.deactive, success: true, data: newDetails })
        }).catch((error) => {
            res.status(400).json({ message: specializationCategory.toggle.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getAllCategory = async (req, res) => {
    try {

        const paginationObject = pagination(req.query.limit || 10, req.query.page || 1, await SpecializationCategoryModel.countDocuments({ isDeleted: false }))

        SpecializationCategoryModel.find().skip(paginationObject.skip).limit(paginationObject.limit).then((details) => {
            res.status(200).json({ message: specializationCategory.getAll.success, success: true, data: details, pagination: paginationObject })
        }).catch((error) => {
            res.status(400).json({ message: specializationCategory.getAll.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getSingleCategory = async (req, res) => {
    try {
        const { id } = req.params;

        SpecializationCategoryModel.findOne({ _id: id, isDeleted: false }).then((details) => {
            if (!details) {
                return res.status(400).json({ message: specializationCategory.getSingle.notfound, success: false })
            }
            res.status(200).json({ message: specializationCategory.getSingle.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: specializationCategory.getSingle.failed, success: false, error: error.toString() })
        })

    } catch (error) {
        res.status(500).json(commonError(error))
    }
}

exports.getActiveCategories = async (req, res) => {
    try {

        SpecializationCategoryModel.find({ isActive: true }).then((details) => {
            res.status(200).json({ message: specializationCategory.getAll.success, success: true, data: details })
        }).catch((error) => {
            res.status(400).json({ message: specializationCategory.getAll.failed, success: false, error: error.toString() })
        })
    } catch (error) {
        res.status(500).json(commonError(error))
    }
}