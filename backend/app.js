const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
const path = require("path");

const app = express();

//connection à la BDD via mongoose
mongoose
  .connect(
    "mongodb+srv://dbSauces:kokoKOKO88__@cluster0.7n8xu.mongodb.net/saucesDatabase?retryWrites=true&w=majority",
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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
//post un produit
// app.post("/api/stuff", (req, res, next) => {
//   console.log(req.body);
//   res.status(201).json({
//     message: "Objet créé !",
//   });
// });

module.exports = app;
