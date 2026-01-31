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

invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
        title: "Management",
        nav,
        errors: null

    }) 
}

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
    })
}

invCont.registerClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body

    const regClass = await invModel.postNewClassificationName(classification_name)

    if (regClass) {
        req.flash(
            "notice",
            `Successfully, add ${classification_name}.`
        )
        
        res.status(201).render("inventory/management", {
            title: "Management",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry the registration failed.")
        res.status(501).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
        })
    }

}

invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classNames = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classNames,
        errors: null,
    })
}

invCont.registerInventory = async function (req, res, next) {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let nav = await utilities.getNav()
    let classNames = await utilities.buildClassificationList(classification_id)
    const regInv = await invModel.postNewInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id )

    if (regInv) {
        req.flash(
            "notice",
            `Successfully, add ${inv_make + " " + inv_model + " " + inv_year}.`
        )
        
        res.status(201).render("inventory/management", {
            title: "Management",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry the registration failed.")
        res.status(501).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classNames,
            errors: null,
        })
    }
    
}
module.exports = invCont