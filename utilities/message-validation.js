const utilities = require(".")
const { validationResult, body } = require("express-validator")
const msgModel = require("../models/message-model")

const validate = {}

validate.messageRules = () => {
    return [
        body("message_from")
            .notEmpty().withMessage("Please Select Cant be empty"),

        body("message_body")
            .trim()
            .notEmpty()
            .isLength( {min: 1})
            .withMessage("Please provide a valid message"),

        body("message_subject")
            .trim()
            .notEmpty()
            .isLength( {min: 1})
            .withMessage("Please provide a valid subject"),
    ]
}

validate.replyRules = () => {
    return [
        body("reply_from")
            .notEmpty().withMessage("Please Select Cant be empty"),

        body("reply_body")
            .trim()
            .notEmpty()
            .isLength( {min: 1})
            .withMessage("Please provide a valid message"),

        body("reply_subject")
            .trim()
            .notEmpty()
            .isLength( {min: 1})
            .withMessage("Please provide a valid subject"),
    ]
}


validate.checkMessageData = async (req, res, next) => {
    
    const {message_from, message_to, message_body, message_subject} = req.body
    let userList = await utilities.buildUserList(message_from)
    let errors
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("message/new-message", {
            errors,
            title : "New Message",
            nav,
            userList,
            message_body,
            message_from,
            message_to,
            message_subject
            

          }  

        )
        return
    }

    next()

}

validate.checkReplyData = async (req, res, next) => {
    const messageId = req.query.id
    const {reply_from, reply_to, reply_body} = req.body
    const messageData = await msgModel.getMessageByMsgId(parseInt(messageId))
    
    let errors
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("message/reply", {
            errors,
            title : "New Message",
            nav,
            reply_from, 
            reply_to, 
            reply_body,
            messageData
            

          }  

        )
        return
    }

    next()

}

module.exports = validate