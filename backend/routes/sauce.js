const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauceCtrl = require("../controllers/sauce");
const validate = require("../middleware/validate-inputs");
//const validat = require("../middleware/validatSauce");
const isOwner = require("../middleware/isOwner");
//const likeValidate = require("../middleware/likingValidate");
//const validateUser = require("../middleware/validateUser");

router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, isOwner, validate.sauce, multer, sauceCtrl.modifySauce);
//router.put("/:id", auth, validate.id, validate.sauce, multer, sauceCtrl.modifySauce);
//router.put("/:id", auth, isOwner, multer, sauceCtrl.modifySauce);

router.delete("/:id", auth, isOwner, sauceCtrl.deleteSauce);

//router.delete("/:id", auth, isOwner, sauceCtrl.deleteSauce);

router.post("/:id/like", auth, sauceCtrl.likeDislike);

module.exports = router;

// router.post("/", auth, validate.sauce, multer, sauceCtrl.createSauce);
// router.get("/", auth, sauceCtrl.getAllSauce);
// router.get("/:id", auth, validate.id, sauceCtrl.getOneSauce);
// router.put("/:id", auth, validate.id, validate.sauce, multer, sauceCtrl.modifySauce);
// router.delete("/:id", validate.id, sauceCtrl.deleteSauce);
// router.post("/:id/like", auth, validate.sauce, validate.like, sauceCtrl.likeDislike);
