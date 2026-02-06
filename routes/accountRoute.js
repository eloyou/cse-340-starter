const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.post(
    "/register", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))


router.get("/:accountId", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))
router.post("/logout", utilities.handleErrors((req, res) => {
  
  req.session.destroy(err => {
    if (err) {
      return res.redirect("/");
    }
    res.clearCookie("jwt");
    res.clearCookie("sessionId");
    res.redirect("/account/login");
  });
})
  
)

router.get("/edit/:accountId", utilities.checkLogin, utilities.handleErrors(accountController.buildEditAccountView))
router.post(
  "/edit",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

router.post(
  "/edit-password",
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)
module.exports = router