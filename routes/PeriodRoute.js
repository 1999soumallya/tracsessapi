const Router = require("express").Router()

const { addPeriod, getAllPeriod, getSinglePeriod, tooglePeriod, deletePeriod } = require("../controllers/PeriodController")
const validate = require("../helpers/Validation")
const { isOrganizer } = require("../middleware")
const { addPeriodValidation, commonPeriodValidation } = require("../validation/PeriodValidation")


Router.post("/add-period", [addPeriodValidation, validate], addPeriod)
Router.get("/get-all-period", isOrganizer, getAllPeriod)
Router.get("/get-single-period/:id", isOrganizer, [commonPeriodValidation, validate], getSinglePeriod)
Router.patch("/toogle-period/:id", isOrganizer, [commonPeriodValidation, validate], tooglePeriod)
Router.delete("/delete-period/:id", isOrganizer, [commonPeriodValidation, validate], deletePeriod)

module.exports = Router