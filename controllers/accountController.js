const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null
    })
}

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Signup",
        nav,
        errors: null
    })
}

async function registerAccount(req, res) {
    let nav = utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_password} = req.body

    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )

        
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null
        })

    } else {
        req.flash("notice", "Sorry the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}


async function accountLogin(req,res) {
    let nav = utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again")
        res.status(400).redirect("account/login/" , {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })

        return
    }

    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
            if (process.env.NODE_ENV === "development") {
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
            } else {
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000})
            }

            return res.redirect(`/account/${accountData.account_id}`)
        } else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (err) {
        throw new Error("Access Forbidden")

    }
}

async function buildManagement(req,res) {
    let nav = await utilities.getNav()
    const accountId = req.params.accountId
    const accountData = await accountModel.getAccountById(accountId)
    res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_id: accountData.account_id

    })
    
}

async function buildEditAccountView(req, res) {
    let nav = await utilities.getNav()
    let accountId = req.params.accountId
    const itemData = await accountModel.getAccountById(accountId)

    if (itemData) {
        res.render("account/edit-account", {
        title: "Edit Account",
        nav,
        errors: null,
        account_id: itemData.account_id,
        account_firstname: itemData.account_firstname,
        account_lastname: itemData.account_lastname,
        account_email: itemData.account_email,
        
      })

    } else {
        req.flash("notice", "Account not found")
        res.redirect(`/account/${accountId}`)
    }
    
    
}

async function updateAccount(req, res) {
    const { account_id, account_firstname, account_lastname, account_email} = req.body
    const accountData = await accountModel.getAccountById(account_id)

    if (account_firstname === accountData.account_firstname && account_lastname === accountData.account_lastname && account_email === accountData.account_email) {
        req.flash("notice", "No changes detected")
        res.redirect(`/account/edit/${account_id}`)
    } 

    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

    if (updateResult) {
        req.flash("notice", "Updated successfully")
        res.redirect(`/account/${account_id}`)
    } else {
        let nav = await utilities.getNav()
        res.render("account/edit-account", {
                        errors: null,
                        title: "Edit Account",
                        nav,
                        account_id,
                        account_email,
                        account_firstname,
                        account_lastname
                    })
        
    }
    
}

async function updatePassword(req, res) {
    const { account_password} = req.body
    let nav = await utilities.getNav()
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/edit-account", {
        title: "Edit Account",
        nav,
        errors: null,
        })
    }
    
    const updatePass = await accountModel.updatePassword(res.locals.user.account_id, hashedPassword)

    if (updatePass) {
        req.flash("notice", "Password changed successfully")
        res.redirect(`/account/${res.locals.user.account_id}`)
    } else {
        req.flash("notice", "Password changed unsuccessfully!")
        res.redirect(`/account/edit/${res.locals.user.account_id}`)
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement , buildEditAccountView, updateAccount, updatePassword}