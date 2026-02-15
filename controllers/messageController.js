const utilities = require("../utilities")
const msgModel = require("../models/message-model")


const msgCont = {}

msgCont.getMessages = async (req, res, next) => {
    const msg = await msgModel.getMessagesBySenderId(res.locals.accountData.account_id)

    if (!msg) {
        next(new Error("Error Processing"))
    }

    return res.json(msg)
}

msgCont.buildInboxView = async (req, res, next) => {
    let nav = await utilities.getNav()

    res.render("message/inbox", {
        title: res.locals.accountData.account_firstname + " " + res.locals.accountData.account_lastname + " " + "Inbox",
        nav,
        errors: null
    })
    
}

msgCont.buildCreateMessageView = async (req, res ) => {
    let nav = await utilities.getNav()
    let userList = await utilities.buildUserList()

    res.render("message/new-message", {
        title: "New Message",
        userList,
        nav,
        errors: null,
    })
}

msgCont.sendMessage = async (req, res ) => {
    
    const { message_subject, message_body, message_to, message_from} = req.body

    const messageData = await msgModel.postMessage(message_subject, message_body, message_to, message_from)

    if (!messageData) {
        req.flash("notice", "Error Sending")
        res.redirect(`/message/new?user=${res.locals.accountData.account_id}`)
    }

    req.flash("notice", "Succesfully sent the message.")
    res.redirect(`/message/inbox?user=${res.locals.accountData.account_id}`)
}

msgCont.buildMessageContentView = async (req, res ) => {
    let nav = await utilities.getNav()
    const id = req.query.id
    const messageData = await msgModel.getMessageByMsgId(id)

    if (!messageData) {
        req.flash("notice", "Error Viewing Message")
        res.redirect(`/message/inbox?user=${res.locals.accountData.account_id}`)
    }

    res.render("message/message", {
        title: messageData.message_subject,
        nav,
        errors: null,
        messageData,
    })
    
}

msgCont.markMessage = async (req, res ) => {
    
    const { id} = req.body
    const message = await msgModel.updateMessageAsRead(parseInt(id))

    if (!message) {
        req.flash("notice", "Error Marking Message")
        res.redirect(`/message/content?id=${id}&user=${res.locals.accountData.account_id}`)
    }
    

    return res.json(message)
}

msgCont.archiveMessage = async (req, res ) => {
    
    const { id } = req.body
    const message = await msgModel.updateArchive(parseInt(id))
    console.log(message)
    
    if (!message) {
        req.flash("notice", "Error Archiving Message")
        res.redirect(`/message/content?id=${id}&user=${res.locals.accountData.account_id}`)
    }

    return res.json(message)
}

msgCont.deleteMessage = async (req, res ) => {
    
    const { id } = req.body
    const message = await msgModel.deleteMessage(parseInt(id))
    console.log(message)
    
    if (!message) {
        req.flash("notice", "Error Deleting Message")
        res.redirect(`/message/content?id=${id}&user=${res.locals.accountData.account_id}`)
    }

    return res.json(message)
}
msgCont.buildArchiveView = async (req, res, next) => {
    let nav = await utilities.getNav()

    res.render("message/archive", {
        title: "Archived Messages",
        nav,
        errors: null
    })
    
}

msgCont.getArchive = async (req, res, next) => {
    const msg = await msgModel.getArchivedMessages(res.locals.accountData.account_id)

    if (!msg) {
        next(new Error("Error Processing"))
    }

    return res.json(msg)
}

msgCont.buildReplyView = async (req, res, next) => {
    let nav = await utilities.getNav()
    const messageId = req.params.messageId
    const messageData = await msgModel.getMessageByMsgId(messageId)

    if (!messageData) {
        next(new Error("Error Processing"))
    }

    res.render("message/reply", {
        title: "Reply" + " to " + messageData.account_firstname + " " + messageData.account_lastname,
        errors: null,
        nav,
        messageData
    })
}

msgCont.replyMessage = async (req, res, next) => {
    const { reply_from, reply_to, reply_body , reply_subject} = req.body
    const replyData = await msgModel.postMessage(reply_subject, reply_body, reply_to, reply_from)

    if (!replyData) {
        req.flash("Error inserting data")
        return res.redirect(`/message/content?id=${reply_from}&user=${res.locals.accountData.account_id}`)
    }

    req.flash("Replied Succesfully")
    return res.redirect(`/message/inbox?user=${res.locals.accountData.account_id}`)

    
}



module.exports = msgCont