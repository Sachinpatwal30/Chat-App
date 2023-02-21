const { sendMessage, allMessages } = require("../controllers/messageController");
const verifyToken = require("../middleware/verifyJwt");

const router = require("express").Router();

router.post("/", verifyToken, sendMessage);
router.get("/:chatId", verifyToken, allMessages);

module.exports = router;
