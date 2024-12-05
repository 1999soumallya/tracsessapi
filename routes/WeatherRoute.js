const { createWeather, updateWeather, deleteWeather, toggleWeather, getAllWeather, getActiveWeather, getSingleWeather } = require('../controllers/WeatherController')
const validate = require('../helpers/Validation')
const { createWeatherValidation, updateWeatherValidation, commonWeatherValidation } = require('../validation/WeatherValidation')

const Router = require('express').Router()

Router.route('/create').post([createWeatherValidation, validate], createWeather)
Router.route('/update/:id').put([updateWeatherValidation, validate], updateWeather)
Router.route('/delete/:id').delete([commonWeatherValidation, validate], deleteWeather)
Router.route('/toggle/:id').patch([commonWeatherValidation, validate], toggleWeather)

Router.route('/get-all').get(getAllWeather)
Router.route('/get-active').get(getActiveWeather)
Router.route('/get-single/:id').get([commonWeatherValidation, validate], getSingleWeather)

module.exports = Router