const { registerUser, loginUser, allUser } = require("../controllers/authController");
const verifyToken = require("../middleware/verifyJwt");

const router= require("express").Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/",verifyToken,allUser);

module.exports= router;