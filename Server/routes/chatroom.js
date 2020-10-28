const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const chatroomController = require("../controllers/chatroomController");

router.get("/",  catchErrors(chatroomController.getAllChatrooms));
router.post("/",  catchErrors(chatroomController.createChatroom));

module.exports = router;
