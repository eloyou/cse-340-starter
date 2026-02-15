const express = require("express")
const router = new express.Router()
const messageController = require("../controllers/messageController")
const utilities = require("../utilities")
const validate = require("../utilities/message-validation")

router.get("/getmessages", utilities.checkLogin, utilities.handleErrors(messageController.getMessages))
router.get("/inbox", utilities.checkLogin, utilities.handleErrors(messageController.buildInboxView))
router.get("/new",  utilities.checkLogin, utilities.handleErrors(messageController.buildCreateMessageView))
router.post("/send", 
    utilities.checkLogin, 
    validate.messageRules(),
    validate.checkMessageData,
    utilities.handleErrors(messageController.sendMessage))
router.get("/content", utilities.checkLogin, utilities.handleErrors(messageController.buildMessageContentView))
router.post("/mark", utilities.checkLogin, utilities.handleErrors(messageController.markMessage))
router.post("/archive", utilities.checkLogin, utilities.handleErrors(messageController.archiveMessage))
router.post("/delete", utilities.checkLogin, utilities.handleErrors(messageController.deleteMessage))
router.get("/archive", utilities.checkLogin, utilities.handleErrors(messageController.buildArchiveView))
router.get("/getarchive", utilities.checkLogin, utilities.handleErrors(messageController.getArchive))
router.get("/reply/:userId/content/:messageId", utilities.checkLogin, utilities.handleErrors(messageController.buildReplyView))
router.post("/reply", 
    utilities.checkLogin, 
    validate.replyRules(),
    validate.checkReplyData,
    utilities.handleErrors(messageController.replyMessage))

module.exports = router