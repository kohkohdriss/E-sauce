const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const validate = require("../middleware/validate-inputs");
//routes attendus par le frontend
router.post("/signup", validate.user, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
