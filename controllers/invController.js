const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

invCont.buildByClasificationId = async function (req, res, next) {
    
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
        return next({status: 404, message: 'Sorry, we appear to have lost that page.'})
    }
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })

}

invCont.buildByInventoryId = async function (req, res, next) {
    const inventoryId = req.params.inventoryId
    const data = await invModel.getInventoryById(inventoryId)

    if (!data || data.length === 0) {
        return next({status: 404, message: 'Sorry, we appear to have lost that page.'})
    }
    const grid = await utilities.buildInventoryGrid(data)
    let nav = await utilities.getNav()
    const inv_make = data[0].inv_make
    const inv_model = data[0].inv_model
    const inv_year = data[0].inv_year
    res.render("./inventory/inventory", {
        title: `${inv_make}  ${inv_model} ${inv_year}`,
        nav,
        grid,
    })



}

module.exports = invCont