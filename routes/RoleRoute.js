const { createRole, updateRole, toggleRole, deleteRole, getActiveRole, getRoles, getRoleDetails, removeRolePermission } = require('../controllers/RoleController')
const validate = require('../helpers/Validation')
const { isAuthorized } = require('../middleware')
const { createRoleValidation, updateRoleValidation, toggleRoleValidation, deleteRoleValidation, singleRoleValidation, removePermissionValidation } = require('../validation/RoleValidation')

const Router = require('express').Router()

Router.route('/create').post(isAuthorized, [createRoleValidation, validate], createRole)
Router.route('/update/:role_id').put(isAuthorized, [updateRoleValidation, validate], updateRole)
Router.route('/remove-permission').put(isAuthorized, [removePermissionValidation, validate], removeRolePermission)
Router.route('/toggle/:role_id').patch(isAuthorized, [toggleRoleValidation, validate], toggleRole)
Router.route('/delete/:role_id').delete(isAuthorized, [deleteRoleValidation, validate], deleteRole)
Router.route('/active-all').get(isAuthorized, getActiveRole)
Router.route('/all').get(isAuthorized, getRoles)
Router.route('/details/:role_id').get(isAuthorized, [singleRoleValidation, validate], getRoleDetails)

module.exports = Router