const utilities = require("../utilities")
const msgModel = require("../models/message-model")


const msgCont = {}

msgCont.buildInboxView = async function (req, res) {
    const accountId = req.params.userId

    const messageList = await msgModel.getMessagesBySenderId(accountId)
    let titleInbox = `${res.locals.accountData.account_firstname} ${res.locals.accountData.account_lastname}`
    let nav = await utilities.getNav()
    res.render("message/inbox" , {
        title: titleInbox,
        errors: null,
        nav,
        messageList
    })
    
}

msgCont.buildNewMessageView = async function (req, res) {
    let nav = await utilities.getNav()
    
    const userList = await msgModel.getUserList()
    res.render("message/new-message", {
        title: "New Message",
        nav,
        errors: null,
        userList,

    })

}

msgCont.postNewMessage = async function (req, res) {
    const {message_subject, message_body, message_to, message_from} = req.body
    let nav = await utilities.getNav()
    const messageInput = await msgModel.postMessage(message_subject, message_body, message_to, message_from)

    if (!messageInput) {
        req.flash("notice", "Error processing you message")
        res.redirect("/account/")
    } 

    req.flash("notice", "Sent Successfully")
    res.redirect(`/message/inbox/${res.locals.accountData.account_id}`)
    
}

msgCont.buildMessageView = async function (req, res, next) {
    const msgId = req.query.id
    let nav = await utilities.getNav()
    const msgData = await msgModel.getMessageByMsgId(msgId)

    if (!msgData) {
        res.redirect(`/message/inbox/${res.locals.accountData.account_id}`)
        next(new Error("No Message returned"))
    }else {
        
        res.render("message/message", {
            title: msgData.message_subject,
            errors: null,
            nav

        })

    }
}
msgCont.getMessage = async function (req, res, next) {
    const msgId = parseInt(req.query.id)
    const msgData = await msgModel.getMessageByMsgId(msgId)

    if (!msgData) {
        res.redirect(`/message/inbox/${res.locals.accountData.account_id}`)
        next(new Error("No Message returned"))
    } else {
        res.json(msgData)
        
    }
  
}

msgCont.updateMessageAsRead = async function (req, res) {

    const { userId } = req.body

    const updateData = await msgModel.updateMessageAsRead(parseInt(userId))

    
    if (!updateData) {
        req.flash("notice", "Error in updating data!")
        return res.redirect(`/message/index/${res.locals.accountData.account_id}`)
    } else {

        return res.json({
                success: true,
                message: "Message marked as read"
            });
    }

}

msgCont.updateArchiveRead = async function (req, res) {

    const { userId } = req.body

    const updateData = await msgModel.updateArchiveRead(parseInt(userId))

    
    if (!updateData) {
        req.flash("notice", "Error in updating data!")
        return res.redirect(`/message/index/${res.locals.accountData.account_id}`)
    } else {

        return res.json({
                success: true,
                message: "Message marked as read"
            });
    }

}

msgCont.deleteMessage = async function (req, res) {

    const { userId } = req.body

    const updateData = await msgModel.deleteMessage(parseInt(userId))

    
    if (!updateData) {
        req.flash("notice", "Error in updating data!")
        return res.redirect(`/message/index/${res.locals.accountData.account_id}`)
    } else {

        return res.json({
                success: true,
                message: "Message marked as read"
            });
    }

}
module.exports = msgCont