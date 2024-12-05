const { body, param } = require("express-validator");
const RoleModel = require("../models/RoleModel");
const PermissionModel = require("../models/PermissionModel");

exports.createRoleValidation = [
    body("name").notEmpty().withMessage("Role name is required").custom(async (value, { req }) => {
        const existingRole = await RoleModel.findOne({ alias: value.replace(/\s/g, '-').toLowerCase(), [req.usertype]: req.userdetails._id });
        if (existingRole) {
            throw new Error("Role already exists");
        }
        return true;
    }),
    body("permissions").notEmpty().withMessage("Permissions are required").isArray().withMessage("Permissions should be an array"),
    body("permissions.*").notEmpty().withMessage("Provide valid permission for update role").isMongoId().withMessage("Provide valid permission for update role").custom(async (value, { req }) => {
        const existingPermission = await PermissionModel.findOne({ alias: value.replace(/\s/g, '-').toLowerCase(), platform: req.usertype, isActive: true })
        if (existingPermission) {
            return true;
        }
        throw new Error("Permission is not exists provide valid permission");
    }),
]

exports.updateRoleValidation = [
    param("role_id").notEmpty().withMessage("Provide valid role id for update role").isMongoId().withMessage("Provide valid role id for update role").custom(async (value, { req }) => { 
        const existingRole = await RoleModel.findOne({ _id: value, [req.usertype]: req.userdetails._id });
        if (!existingRole) {
            throw new Error("Role is not exists provide valid role id for update role");
        } else {
            return true;
        }
    }),
    body("name").notEmpty().withMessage("Role name is required").custom(async (value, { req }) => {
        const existingRole = await RoleModel.findOne({ alias: value.replace(/\s/g, '-').toLowerCase(), [req.usertype]: req.userdetails._id, _id: { $nin: req.params.role_id } });
        if (existingRole) {
            throw new Error("Role already exists with this name");
        }
        return true;
    }),
    body("permissions").notEmpty().withMessage("Permissions are required").isArray().withMessage("Permissions should be an array"),
    body("permissions.*").notEmpty().withMessage("Provide valid permission for update role").isMongoId().withMessage("Provide valid permission for update role").custom(async (value, { req }) => {
        const existingPermission = await PermissionModel.findOne({ alias: value.replace(/\s/g, '-').toLowerCase(), platform: req.usertype, isActive: true })
        if (existingPermission) {
            return true;
        }
        throw new Error("Permission is not exists provide valid permission");
    }),
]

exports.removePermissionValidation = [
    body("role_id").notEmpty().withMessage("Provide valid role id for update role").isMongoId().withMessage("Provide valid role id for update role").custom(async (value, { req }) => {
        const existingRole = await RoleModel.findOne({ _id: value, [req.usertype]: req.userdetails._id });
        if (!existingRole) {
            throw new Error("Role is not exists provide valid role id for update role");
        } else {
            return true;
        }
    }),
    body("permissions").notEmpty().withMessage("Provide valid permissions id for update role").isMongoId().withMessage("Provide valid permissions id for update role")
]


exports.toggleRoleValidation = [
    param("role_id").notEmpty().withMessage("Provide valid role id for update role status").isMongoId().withMessage("Provide valid role id for update role status").custom(async (value, { req }) => {
        const existingRole = await RoleModel.findOne({ _id: value, [req.usertype]: req.userdetails._id });
        if (!existingRole) {
            throw new Error("Role is not exists provide valid role id for update role status");
        } else {
            return true;
        }
    }),
]

exports.deleteRoleValidation = [
    param("role_id").notEmpty().withMessage("Provide valid role id for delete role").isMongoId().withMessage("Provide valid role id for delete role").custom(async (value, { req }) => {
        const existingRole = await RoleModel.findOne({ _id: value, [req.usertype]: req.userdetails._id });
        if (!existingRole) {
            throw new Error("Role is not exists provide valid role id for delete role");
        } else {
            return true;
        }
    }),
]

exports.singleRoleValidation = [
    param("role_id").notEmpty().withMessage("Provide valid role id for role details").isMongoId().withMessage("Provide valid role id for role details").custom(async (value, { req }) => {
        const existingRole = await RoleModel.findOne({ _id: value, [req.usertype]: req.userdetails._id });
        if (!existingRole) {
            throw new Error("Role is not exists provide valid role id for role details");
        } else {
            return true;
        }
    }),
]