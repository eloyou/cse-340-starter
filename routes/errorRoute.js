const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const errorController = require("../controllers/errorController")

router.get("/error500", utilities.handleErrors(errorController.error500))

module.exports = router