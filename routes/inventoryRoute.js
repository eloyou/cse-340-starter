const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidator = require("../utilities/inventory-validation")

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClasificationId))
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))
router.get("/", utilities.checkLogin, utilities.checkAdmin, utilities.handleErrors(invController.buildManagement))
router.get("/add-classification",utilities.checkLogin, utilities.checkAdmin, utilities.handleErrors(invController.buildAddClassification))
router.post("/add-classification", 
    invValidator.classificationNameRules(),
    invValidator.checkClassificationData,
    utilities.handleErrors(invController.registerClassification))
router.get("/add-inventory", utilities.checkLogin, utilities.checkAdmin, utilities.handleErrors(invController.buildAddInventory))
router.post("/add-inventory", 
    invValidator.inventoryRules(),
    invValidator.checkInventoryData,
    utilities.handleErrors(invController.registerInventory))

router.get("/getInventory/:classification_id", utilities.checkLogin, utilities.checkAdmin, utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inventoryId", utilities.checkLogin, utilities.checkAdmin, utilities.handleErrors(invController.editInventoryView))
router.post("/update/",
    invValidator.inventoryRules(),
    invValidator.checkUpdateData,
    invController.updateInventory)

router.get("/delete/:inventoryId", utilities.checkLogin, utilities.checkAdmin, utilities.handleErrors(invController.buildDeleteView))
router.post("/delete-inventory", utilities.handleErrors(invController.deleteInventory))
module.exports = router