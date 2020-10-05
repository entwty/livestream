const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const chatroomController = require("../controllers/chatroomController");


router.post("/",  catchErrors(chatroomController.createChatroom));

module.exports = router;
