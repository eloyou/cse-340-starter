const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

invCont.buildByClasificationId = async function (req, res, next) {
    
    const classification_id = parseInt(req.params.classificationId)
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
        return next({status: 404, message: 'Sorry, we appear to have lost that page.'})
    }
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })

}

invCont.buildByInventoryId = async function (req, res, next) {
    const inventoryId = parseInt(req.params.inventoryId)
    const data = await invModel.getInventoryById(inventoryId)
    if (!data || data.length === 0) {
        return next({status: 404, message: 'Sorry, we appear to have lost that page.'})
    }
    const grid = await utilities.buildInventoryGrid(data)
    let nav = await utilities.getNav()
    const inv_make = data.inv_make
    const inv_model = data.inv_model
    const inv_year = data.inv_year
    res.render("inventory/inventory", {
        title: `${inv_make}  ${inv_model} ${inv_year}`,
        nav,
        grid,
    })

}

invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()

    res.render("inventory/management", {
        title: "Management",
        nav,
        errors: null,
        classificationList,

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
    const classificationList = await utilities.buildClassificationList()
    const regClass = await invModel.postNewClassificationName(classification_name)

    if (regClass) {
        req.flash(
            "notice",
            `Successfully, add ${classification_name}.`
        )
        
        res.status(201).render("inventory/management", {
            title: "Management",
            nav,
            errors: null,
            classificationList
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
    let classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: null,
    })
}

invCont.registerInventory = async function (req, res, next) {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    const regInv = await invModel.postNewInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id )

    if (regInv) {
        req.flash(
            "notice",
            `Successfully, add ${inv_make + " " + inv_model + " " + inv_year}.`
        )
        
        res.status(201).render("inventory/management", {
            title: "Management",
            nav,
            errors: null,
            classificationList,
        })
    } else {
        req.flash("notice", "Sorry the registration failed.")
        res.status(501).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors: null,
        })
    }
    
}

invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

// update inventory
invCont.editInventoryView = async (req, res, next) => {
    let nav = await utilities.getNav()
    const inv_id  = parseInt(req.params.inventoryId)
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationList = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList: classificationList,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    
    })
    
}

invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

invCont.buildDeleteView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const inventoryId = parseInt(req.params.inventoryId)
    const itemData = await invModel.getInventoryById(inventoryId)

    const itemName = itemData.inv_make + " " + itemData.inv_model
    
    res.render("inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_id: itemData.inv_id,
    })

}

invCont.deleteInventory = async function (req, res, next) {
    const { inv_id , inv_make, inv_model, inv_year} = req.body
    const deleteItem = await invModel.deleteInventory(inv_id)
    let nav = await utilities.getNav()

    if (deleteItem) {
        req.flash("notice", "Successfuly Deleted " + deleteItem.inv_model + " " + deleteItem.inv_make)
        res.redirect("/inv/")

    } else {
            req.flash("notice", "Sorry, the deletion failed.")
            res.status(501).render("inventory/delete-confirm", {
            title: "Delete " + itemName,
            nav,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
        })

    }

}

module.exports = invCont