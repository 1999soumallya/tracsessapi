const { addSuspensionType, updateSuspensionType, deleteSuspensionType, toggleSuspensionType, getSuspensionType, getActiveSuspensionType } = require('../controllers/SuspensionSettingsController')
const validate = require('../helpers/Validation')
const { isTuner } = require('../middleware')
const { addSettingsValidation, updateSettingsValidation, deleteSettingsValidation, toggleSettingsValidation } = require('../validation/SuspensionSettingValidation')

const Router = require('express').Router()

Router.route('/create').post([addSettingsValidation, validate], addSuspensionType)
Router.route('/update/:id').put([updateSettingsValidation, validate], updateSuspensionType)
Router.route('/delete/:id').delete([deleteSettingsValidation, validate], deleteSuspensionType)
Router.route('/toggle/:id').patch([toggleSettingsValidation, validate], toggleSuspensionType)

Router.route('/get-all').get(getSuspensionType)
Router.route('/get-active').get(isTuner, getActiveSuspensionType)

module.exports = Router