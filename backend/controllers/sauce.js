const Sauce = require("../models/sauce");
const fs = require("fs");

//l'ajout d'une sauce à la BDD
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
   imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    userDisliked: [],
  });
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
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//affichaes de toutes les sauces
exports.getAllSauce = (req, res, next) => {
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

      console.log("sauceuserId", sauce.userId);
    })
    .catch((error) =>
      res.status(404).json({
        error,
      })
    );
};

//Modifier le produit sauce
// exports.modifySauce = (req, res, next) => {
//   const sauceObject = req.file
//     ? {
//         ...JSON.parse(req.body.sauce),
//         imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
//       }
//     : { ...req.body };
//   Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
//     .then(() => res.status(200).json({ message: "Objet modifié !" }))
//     .catch((error) => res.status(400).json({ error }));
// };


//new code modifier sauce
exports.modifySauce = (req, res, next) => {
  if (req.file) {
      // si l'image est modifiée, il faut supprimer l'ancienne image dans le dossier /image
      Sauce.findOne({ _id: req.params.id })
          .then(sauce => {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  // une fois que l'ancienne image est supprimée dans le dossier /image, on peut mettre à jour le reste
                  const sauceObject = {
                      ...JSON.parse(req.body.sauce),
                      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                  }
                  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                      .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                      .catch(error => res.status(400).json({ error }));
              })
          })
          .catch(error => res.status(500).json({ error }));
  } else {
      // si l'image n'est pas modifiée
      const sauceObject = { ...req.body };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
          .catch(error => res.status(400).json({ error }));
  }
};


//Like dislike

exports.likeDislike = (req, res, next) => {
  // Pour la route READ = Ajout/suppression d'un like / dislike à une sauce
  // Like présent dans le body
  let like = req.body.like;
  // On prend le userID
  let userId = req.body.userId;

  // On prend l'id de la sauce
  let sauceId = req.params.id;

  if (like === 1) {
    // Si il s'agit d'un like
    Sauce.updateOne(
      {
        _id: sauceId,
      },
      {
        // On push l'utilisateur et on incrémente le compteur de 1
        $push: {
          usersLiked: userId,
        },
        $inc: {
          likes: +1,
        }, // On incrémente de 1
      }
    )
      .then(() =>
        res.status(200).json({
          message: "like ajouté !",
        })
      )
      .catch((error) =>
        res.status(400).json({
          error,
        })
      );
  }
  if (like === -1) {
    Sauce.updateOne(
      // S'il s'agit d'un dislike
      {
        _id: sauceId,
      },
      {
        $push: {
          usersDisliked: userId,
        },
        $inc: {
          dislikes: +1,
        }, // On incrémente de 1
      }
    )
      .then(() => {
        res.status(200).json({
          message: "Dislike ajouté !",
        });
      })
      .catch((error) =>
        res.status(400).json({
          error,
        })
      );
  }
  if (like === 0) {
    // Si il s'agit d'annuler un like ou un dislike
    Sauce.findOne({
      _id: sauceId,
    })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          // Si il s'agit d'annuler un like
          Sauce.updateOne(
            {
              _id: sauceId,
            },
            {
              $pull: {
                usersLiked: userId,
              },
              $inc: {
                likes: -1,
              }, // On incrémente de -1
            }
          )
            .then(() =>
              res.status(200).json({
                message: "Like retiré !",
              })
            )
            .catch((error) =>
              res.status(400).json({
                error,
              })
            );
        }
        if (sauce.usersDisliked.includes(userId)) {
          // Si il s'agit d'annuler un dislike
          Sauce.updateOne(
            {
              _id: sauceId,
            },
            {
              $pull: {
                usersDisliked: userId,
              },
              $inc: {
                dislikes: -1,
              }, // On incrémente de -1
            }
          )
            .then(() =>
              res.status(200).json({
                message: "Dislike retiré !",
              })
            )
            .catch((error) =>
              res.status(400).json({
                error,
              })
            );
        }
      })
      .catch((error) =>
        res.status(404).json({
          error,
        })
      );
  }
};
