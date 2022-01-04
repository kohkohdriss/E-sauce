const jwt = require("jsonwebtoken");
const Sauce = require("../models/sauce");

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  //console.log(userId);
  const userId = decodedToken.userId;
  console.log("userId :", userId);

  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
     
      console.log("sauce.userId  :", sauce.userId);
      // res.status(200).json(sauce);
      if (sauce.userId !== userId) {
        res.status(403).json({ error: "Vous n'êtes pas autorisés, ni à supprmier ni à modifier!" });
        //next();
      } else {
        console.log("vous êtes le créateur de cette sauce");
        next();
      }
    })
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};
