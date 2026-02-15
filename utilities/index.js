const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountModel = require("../models/account-model")
const msgModel = require("../models/message-model")

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"

  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.user_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildInventoryGrid = async function(data) {
  let grid
  grid = '<div class="inventory-card">'
  grid += '<img src="' + data.inv_image
  + '" alt="image of ' + data.inv_make + ' ' + data.inv_model
  + '">'
  grid += '<div class="inventory-text">'
  grid += '<h2>' + data.inv_make + ' ' + data.inv_model + ' details' + '</h2>'
  grid += '<p>' + '<strong>Price:</strong>' + ' $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
  grid += '<p>' + '<strong>Description:</strong>' + ' ' + data.inv_description + '</p>'
  grid += '<p>' + '<strong>Color:</strong>' + ' ' + data.inv_color + '</p>'
  grid += '<p>' + '<strong>Miles:</strong>' + ' ' + data.inv_miles.toLocaleString() + '</p>'
  grid += '</div>'
  grid += '</div>'

  return grid
}
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

Util.builduserList = async function (user_id = null) {
    let data = await invModel.getClassifications()
    let userList =
      '<select name="user_id" id="userList" required >'
    userList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      userList += '<option value="' + row.user_id + '"'
      if (
        user_id != null &&
        row.user_id == user_id
      ) {
        userList += " selected "
      }
      userList += ">" + row.classification_name + "</option>"
    })
    userList += "</select>"
    return userList
  }

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please Log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }

        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    next()
  }
}

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please Log in.")
    return res.redirect("/account/login")
  }
}

Util.getUser = async (req, res, next) => {
  if (res.locals.loggedin) {
    const userData = await accountModel.getAccountById(res.locals.accountData.account_id)
    res.locals.user = userData
    next()
  } else {
    res.locals.user = null
    return next()
  }
  
}

Util.checkAdmin = async (req, res, next) => {
  
  const role = res.locals.accountData.account_type
  if (role == "Admin" || role == "Employee" ) {
    next()
  } else {
    req.flash("notice", "Please Log in as Admin or Employee")
    return res.redirect("/account/login")
    
  }
}

Util.buildUserList = async function (user_id = null) {
    let data = await msgModel.getUserList()
    let userList =
      '<select name="message_to" id="userList" required >'
    userList += "<option value=''>Choose a user</option>"
    data.rows.forEach((row) => {
      userList += '<option value="' + row.account_id + '"'
      if (
        user_id != null &&
        row.account_id == user_id
      ) {
        userList += " selected "
      }
      userList += ">" + `${row.account_firstname} ${row.account_lastname}` + "</option>"
    })
    userList += "</select>"
    
    return userList
  }

module.exports = Util