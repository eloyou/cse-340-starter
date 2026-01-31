const utilities = require(".")
const { validationResult, body } = require("express-validator")
const inventoryModel = require("../models/inventory-model")

const validate = {}

validate.classificationNameRules = () => {
    return [
        body("classification_name")
            .isAlphanumeric()
            .escape()
            .notEmpty()
            .isLength( {min: 1})
            .withMessage("Please provide a valid classification name")
            .custom( async (classification_name) => {
                const existingClassification = await inventoryModel.checkExistingClassification(classification_name)
                if (existingClassification){
                    throw new Error("Classification name already exist. Provide new one.")
                }
            })
    ]
}

validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .notEmpty()
            .isLength( {min: 1})
            .withMessage("Please provide a valid make name"),

        body("inv_model")
            .trim()
            .notEmpty()
            .isLength( {min: 1})
            .withMessage("Please provide a valid model name"),

        body("inv_year")
            .trim()
            .notEmpty().withMessage("Year is required")
            .isInt({ min: 1900, max: 2100 })
            .withMessage("Enter a valid year"),

        body("inv_description")
            .trim()
            .notEmpty()
            .isLength( {min: 1})
            .withMessage("Please provide a valid description"),

        body("inv_image")
            .trim()
            .notEmpty()
            .isLength( {min: 1})
            .withMessage("Please provide a valid image path"),

        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .isLength( {min: 1})
            .withMessage("Please provide a valid thumbnail path"),

        body("inv_price")
            .trim()
            .notEmpty()
            .isInt()
            .withMessage("Enter a valid price"),

        body("inv_miles")
            .trim()
            .notEmpty()
            .isInt()
            .withMessage("Enter a valid miles"),

        body("inv_color")
            .trim()
            .notEmpty()
            .isLength( {min: 1})
            .withMessage("Please provide a valid color"),

        body("classification_id")
            .trim()
            .notEmpty()
            .isLength( {min: 1})
            .isInt()
            .withMessage("Please select a valid classification name"),
        

    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const {classification_name} = req.body
    let errors
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title : "Add Classification",
            nav,
            classification_name,

          }  

        )
        return
    }

    next()

}

validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classNames = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title : "Add Inventory",
            classNames,
            nav,
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

          }  

        )
        return
    }

    next()

}

module.exports = validate
