const express = require("express")
const router = new express.Router()
const messageController = require("../controllers/messageController")
const utilities = require("../utilities")

router.get("/inbox/:userId", utilities.handleErrors(messageController.buildInboxView))
router.get("/new/:userId", utilities.handleErrors(messageController.buildNewMessageView))
router.post("/sent", utilities.handleErrors(messageController.postNewMessage))
router.get("/content", utilities.handleErrors(messageController.buildMessageView))
router.get("/getmessage", utilities.handleErrors(messageController.getMessage))
router.post("/update", utilities.handleErrors(messageController.updateMessageAsRead))
router.post("/archived", utilities.handleErrors(messageController.updateArchiveRead))
router.post("/delete", utilities.handleErrors(messageController.deleteMessage))

module.exports = router