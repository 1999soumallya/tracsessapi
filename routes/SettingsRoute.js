const { createSettings, updateSettings, toggleSettings, deleteSettings, getAllSettings, getActiveSettings } = require('../controllers/SettingsController')

const SettingsRoutes = require('express').Router()

SettingsRoutes.route('/create').post(createSettings)
SettingsRoutes.route('/update/:setting_id').put(updateSettings)
SettingsRoutes.route('/toggle/:setting_id').patch(toggleSettings)
SettingsRoutes.route('/delete/:setting_id').delete(deleteSettings)
SettingsRoutes.route('/all').get(getAllSettings)
SettingsRoutes.route('/active').get(getActiveSettings)

module.exports = SettingsRoutes