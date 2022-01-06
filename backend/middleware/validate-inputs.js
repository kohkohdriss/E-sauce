const Joi = require("@hapi/joi");
const sauce = require("../models/sauce");

/**
 * Validation des données d'entrée lors du signup et login d'un utilisateur
 */
const userSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(4).required(),
});
exports.user = (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    res.status(422).json({ error: "email ou mot de passe invalide" });
  
  } else {
    next();
  }
};

/**
 * Validation des données d'entrée lors de l'ajout ou la modification d'une sauce
 */
const sauceSchema = Joi.object({
  userId: Joi.string().trim().length(24),
  name: Joi.string().regex(/[a-zA-Z0-9]{3,20}/).min(2).max(20).trim(),
  manufacturer: Joi.string().regex(/[a-zA-Z0-9]{1,20}/),
  description: Joi.string().trim().min(1).max(99),
  mainPepper: Joi.string().trim().min(1).max(20),
  imageUrl:Joi.string().max(100),
  heat: Joi.number().integer().min(1).max(10),
});


exports.sauce = (req, res, next) => {
  let sauce;
  if (req.file) {
    sauce = JSON.parse(req.body.sauce);
    console.log("sauce", sauce);
     console.log("req.body.sauce.userId", sauce);
  } else {
    sauce = req.body;
    console.log("sauce", sauce);
  }

  const { error, value } = sauceSchema.validate(sauce);
  if (error) {
    console.log(error);
    res.status(422).json({ error: "les données saisies ne sont pas valides ou pas permises" });
   
  } else {
    next();
  }
};



/**
 * Validation du like/dislike d'une sauce
 */
const likeSchema = Joi.object({
  userId: Joi.string().trim().length(24).required(),
  like: Joi.valid(-1, 0, 1).required(),
});
exports.like = (req, res, next) => {
  const { error, value } = likeSchema.validate(req.body);
  if (error) {
    res.status(422).json({ error: "Les likes ou dilikes saisis ne  sont pas valides" });
    console.log(error);
  } else {
    next();
  }
};
