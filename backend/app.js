const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
const nocache = require('nocache');
const cookieSession = require('cookie-session');
//path le gestionnaire de routage donne accée au chemin de notre système de fichier 
const path = require("path");
//Helmet helps you secure your Express apps by setting various HTTP headers.
const helmet = require("helmet");
require("dotenv").config();
const app = express();

//connection à la BDD via mongoose
mongoose
  .connect(
    `mongodb+srv://dbSauces:${process.env.DB_PASS}@cluster0.7n8xu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//gestion d'erruer CROSS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


// To remove data, use
//qui nettoie les données fournies par l'utilisateur pour empêcher l'injection d'opérateur MongoDB
app.use(mongoSanitize());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
// sécurité des cookies cookies session
app.use(cookieSession({
  name: 'session',
  keys: [process.env.KEY],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

//Empéche la mise en cache du navigateur
app.use(nocache());

app.use(express.json());
//pour servir un dossier static "images" pour une route donnée avec express.static()  et  path.join()
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
