const { body, param } = require("express-validator");
const PermissionModel = require("../models/PermissionModel");

exports.createPermissionValidation = [
    body('name').notEmpty().withMessage('Provide permission name for create').custom(async (value, { req }) => {
        await PermissionModel.findOne({ alias: value.replace(/\s/g, '-').toLowerCase(), platform: req.body.platform }).then(permission => {
            if (permission) {
                throw new Error('Permission already exists with this name')
            } else {
                return true
            }
        })
    }),
    body('platform').notEmpty().withMessage('Provide permission platform for create').isIn(['admin', 'organizer', 'tuners']).withMessage('Accepted platforms are admin, organizer or tuners'),
    body('description').notEmpty().withMessage('Provide permission description for create'),
    body('module').notEmpty().withMessage('Provide permission module for create a permission').isLowercase().withMessage('Module is only accept lower case value'),
    body('isRead').notEmpty().withMessage('Provide read permission exists or not').isBoolean().withMessage('Provide read permission exists or not'),
    body('isWrite').notEmpty().withMessage('Provide write permission exists or not').isBoolean().withMessage('Provide write permission exists or not'),
    body('isDelete').notEmpty().withMessage('Provide delete permission exists or not').isBoolean().withMessage('Provide delete permission exists or not'),
    body('isAdmin').notEmpty().withMessage('Provide admin permission exists or not').isBoolean().withMessage('Provide admin permission exists or not'),
    body('isActive').optional().isBoolean().withMessage('Provide valid status for permission')
]

exports.updatePermissionValidation = [
    body('platform').notEmpty().withMessage('Provide permission platform for create').isIn(['admin', 'organizer', 'tuners']).withMessage('Accepted platforms are admin, organizer or tuners'),
    param('permission_id').notEmpty().withMessage('Provide valid permission id for update permission').isMongoId().withMessage('Provide valid permission id for update permission').custom(async (value, { req }) => {
        await PermissionModel.findOne({ _id: value, platform: req.body.platform }).then(permission => {
            if (!permission) {
                throw new Error('Permission is not found')
            } else {
                return true
            }
        })
    }),
    body('name').notEmpty().withMessage('Provide permission name for create').custom(async (value, { req }) => {
        await Permission.findOne({ _id: { $ne: req.params.permission_id }, alias: value.replace(/\s/g, '-').toLowerCase(), platform: req.body.platform }).then(permission => {
            if (permission) {
                throw new Error('Permission already exists with this name')
            } else {
                return true
            }
        })
    }),
    body('description').notEmpty().withMessage('Provide permission description for create'),
    body('isRead').notEmpty().withMessage('Provide read permission exists or not').isBoolean().withMessage('Provide read permission exists or not'),
    body('isWrite').notEmpty().withMessage('Provide write permission exists or not').isBoolean().withMessage('Provide write permission exists or not'),
    body('isDelete').notEmpty().withMessage('Provide delete permission exists or not').isBoolean().withMessage('Provide delete permission exists or not'),
    body('isAdmin').notEmpty().withMessage('Provide admin permission exists or not').isBoolean().withMessage('Provide admin permission exists or not'),
    body('isActive').optional().isBoolean().withMessage('Provide valid status for permission')
]

exports.deletePermissionValidation = [
    param('permission_id').notEmpty().withMessage('Provide valid permission id for delete').isMongoId().withMessage('Provide valid permission id for delete').custom(async (value) => {
        await PermissionModel.findOne({ _id: value }).then(permission => {
            if (!permission) {
                throw new Error('Permission is not found')
            } else {
                return true
            }
        })
    })
]

exports.togglePermissionValidation = [
    param('permission_id').notEmpty().withMessage('Provide valid permission id for update status').isMongoId().withMessage('Provide valid permission id for update status').custom(async (value) => {
        await PermissionModel.findOne({ _id: value }).then(permission => {
            if (!permission) {
                throw new Error('Permission is not found')
            } else {
                return true
            }
        })
    })
]

exports.singlePermissionValidation = [
    param('permission_id').notEmpty().withMessage('Provide valid permission id for get details').isMongoId().withMessage('Provide valid permission id for get details').custom(async (value) => {
        await PermissionModel.findOne({ _id: value }).then(permission => {
            if (!permission) {
                throw new Error('Permission is not found')
            } else {
                return true
            }
        })
    })
]