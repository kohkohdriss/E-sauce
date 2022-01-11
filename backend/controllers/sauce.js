//la logique métier sauces
const Sauce = require("../models/sauce");
//fs file système,  Il nous donne accès aux fonctions qui nous permettent de modifier et de supprimer les fichiers.
const fs = require("fs");

//l'ajout d'une sauce à la BDD
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //delete sauceObject._id;
  const sauce = new Sauce({
    //on obtient une instance de notre model sauce
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    userDisliked: [],
  });
  //appel de la méthode save pour enregistre l'objet dans la BDD
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

//Supprimer une sauce de la BDD
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      //unlink : fonction pour supprimer le fichier
      fs.unlink(`images/${filename}`, () => {
        //une fois l'image supprumer, on supprime l'objet de la BDD
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//affichaes de toutes les sauces
exports.getAllSauce = (req, res, next) => {
  //utilisation de la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les sauces  dans notre BDD
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

//affiche une seulle sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) =>
      res.status(404).json({
        error,
      })
    );
};

//new code modifier sauce
exports.modifySauce = (req, res, next) => {
  //1, if : cas req.file existe ou non : nous recevrons l'élément form-data et le fichier
  if (req.file) {
    // si l'image est modifiée, il faut supprimer l'ancienne image dans le dossier /image
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          // une fois que l'ancienne image est supprimée dans le dossier /image, on peut mettre à jour le reste
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          };
          Sauce.updateOne(
            { _id: req.params.id }, //1 er argument, c'est l'objet qu'on va modifer
            { ...sauceObject, _id: req.params.id } //c'est le nouvel objet
          )
            .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
    //2, else(...req.body) : le second cas, nous recevrons uniquement les données JSON.
  } else {
    // si l'image n'est pas modifiée
    const sauceObject = { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

//Like dislike

exports.likeDislike = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;
//1 : quand l'utilisateur clique un like
  if (like === 1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        // on ajoute l'utilisateur qui a liké dans le tableau usersLiked
        $push: { usersLiked: userId },
        //en parallèle on incrémente les likes
        $inc: { likes: +1 },
      }
    )
      .then(() => res.status(200).json({ message: "like ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  }
//2 : quand l'utilisateur clique un dislike
  if (like === -1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        // on ajoute l'utilisateur qui a disliké dans le tableau usersDisliked
        $push: { usersDisliked: userId },
        //en parallèle on incrémente les dislikes
        $inc: { dislikes: +1 },
      }
    )
      .then(() => {
        res.status(200).json({ message: "Dislike ajouté !" });
      })
      .catch((error) => res.status(400).json({ error }));
  }
//3 : quand l'utilisateur annule un like ou un dislike
  if (like === 0) {
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        //cas d'un like annulé
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then(() => res.status(200).json({ message: "Like retiré !" }))
            .catch((error) => res.status(400).json({ error }));
        }
        //cas d'un dislike annulé
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
          )
            .then(() => res.status(200).json({ message: "Dislike retiré !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(404).json({ error }));
  }
};
