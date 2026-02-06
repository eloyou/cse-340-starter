const utilities = require(".") 
const { body , validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}

validate.registrationRules = () => {
    return [
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1})
            .withMessage("Please provide a first name."),
            

        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2})
            .withMessage("Please provide a last name."),

        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists){
                throw new Error("Email exists. Please log in or use different email")
                }
            }),
                        

        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),

    ]
}

validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (!emailExists){
                    throw new Error("Email dont exists. Please register first this email.")
                }
            }),

        body("account_password")
            .trim()
            .notEmpty()
            .withMessage("Password is incorrect"),
    ]
}

validate.updateRules = () => {
    return [
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1})
            .withMessage("Please provide a first name."),
            

        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2})
            .withMessage("Please provide a last name."),

        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            
    ]
}

validate.updatePasswordRules = () => {
    return [
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

validate.checkRegData = async (req, res, next) => {
        const {account_firstname, account_lastname, account_email} = req.body
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav()
            res.render("account/register", {
                errors,
                title: "Registration",
                nav,
                account_firstname,
                account_lastname,
                account_email,
            })

            return
        }

        next()
    }

validate.checkLoginData = async (req, res, next) => {
    const { account_email} = req.body
    let errors
    errors = validationResult(req)
    if (!errors.isEmpty()) {
            let nav = await utilities.getNav()
            res.render("account/login", {
                errors,
                title: "Login",
                nav,
                account_email,
            })

            return
    }

    next()

}

validate.checkUpdateData = async (req, res, next) => {
    const {account_id, account_firstname, account_lastname, account_email} = req.body
    let errors
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/edit-account", {
                errors,
                title: "Edit Account",
                nav,
                account_id,
                account_email,
                account_firstname,
                account_lastname
            })

        return

    }

    next()
}

validate.checkPasswordData = async (req, res, next) => {

    let errors
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/edit-account", {
                errors,
                title: "Edit Account",
                nav,
            })

        return

    }

    next()
}

module.exports = validate
