const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidator = require("../utilities/inventory-validation")

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClasificationId))
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))
router.get("/", utilities.handleErrors(invController.buildManagement))
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.post("/add-classification", 
    invValidator.classificationNameRules(),
    invValidator.checkClassificationData,
    utilities.handleErrors(invController.registerClassification))
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
router.post("/add-inventory", 
    invValidator.inventoryRules(),
    invValidator.checkInventoryData,
    utilities.handleErrors(invController.registerInventory))

module.exports = router