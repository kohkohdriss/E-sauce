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
  userId: Joi.string().trim().length(24).required(),
  name: Joi.string().trim().min(1).required(),
  manufacturer: Joi.string().min(1).required(),
  description: Joi.string().trim().min(1).required(),
  mainPepper: Joi.string().trim().min(1).required(),
  imageUrl: Joi.string(),
  heat: Joi.number().integer().min(1).max(10).required(),
});

/**  pour tester sur postman
 * {
    "userId" :"61b66808f955ff6788433d5a",
    "name": "aaabbbbbbbbba",
    "heat" : 8,
    "manufacturer":"zkazkakz",
    "description" :"sjdjsdjsjd",
    "mainPepper" : "AAAAZAZAZ",
    "imageUrl" : "http://localhost:3000/images/sauce-hp.jpg1639402462524.jpg"

}
 * 
 * 
 * 
*/

//console.log("sauceSchema", sauceSchema);
//console.log("req.file", req.file);

exports.sauce = (req, res, next) => {
  let sauce;
  if (req.file) {
    sauce = JSON.parse(req.body.sauce);
    console.log("sauce", sauce);
    // console.log("req.body.sauce.userId", sauce);
  } else {
    sauce = req.body;
  }

  const { error, value } = sauceSchema.validate(sauce);
  if (error) {
    res.status(423).json({ error: "Les données entrées sont invalides" });
  } else {
    next();
  }
};

/**
 * Validation de l'id des sauces
 */
const idSchema = Joi.string().trim().length(24).required();
exports.id = (req, res, next) => {
  const { error, value } = idSchema.validate(req.params.id);
  if (error) {
    res.status(422).json({ error: "id de la sauce invalide" });
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
    res.status(422).json({ error: "Les données entrées sont invalides" });
  } else {
    next();
  }
};
