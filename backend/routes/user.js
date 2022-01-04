const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const validate = require("../middleware/validate-inputs");

router.post("/signup", validate.user, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;

// router.post("/signup", validate.user, userCtrl.signup);
// router.post("/login", validate.user, userCtrl.login);
