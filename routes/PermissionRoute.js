const { createPermission, updatePermission, togglePermission, deletePermission, getActivePermission, getPermissions, getPermissionDetails } = require('../controllers/PermissionController')
const validate = require('../helpers/Validation')
const { isAuthorized } = require('../middleware')
const { createPermissionValidation, updatePermissionValidation, deletePermissionValidation, togglePermissionValidation, singlePermissionValidation } = require('../validation/PermissionValidation')
const Router = require('express').Router()


Router.route('/create').post([createPermissionValidation, validate], createPermission)
Router.route('/update/:permission_id').put([updatePermissionValidation, validate], updatePermission)
Router.route('/toggle/:permission_id').patch([togglePermissionValidation, validate], togglePermission)
Router.route('/delete/:permission_id').delete([deletePermissionValidation, validate], deletePermission)
Router.route('/active-all').get(isAuthorized, getActivePermission)
Router.route('/all').get(getPermissions)
Router.route('/details/:permission_id').get([singlePermissionValidation, validate], getPermissionDetails)

module.exports = Router