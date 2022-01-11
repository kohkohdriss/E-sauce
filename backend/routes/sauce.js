//configuration du routage 
const express = require("express");
const router = express.Router();  

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauceCtrl = require("../controllers/sauce");
const validate = require("../middleware/validate-inputs");
const isOwner = require("../middleware/isOwner");
//routes attendus par le frontend
router.post("/", auth, multer,validate.sauce, sauceCtrl.createSauce);
router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, isOwner, multer,validate.sauce, sauceCtrl.modifySauce);
router.delete("/:id", auth, isOwner, sauceCtrl.deleteSauce);

router.post("/:id/like", auth,validate.like, sauceCtrl.likeDislike);

module.exports = router;