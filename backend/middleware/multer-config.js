//multer : un package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
//configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({ 
  destination: (req, file, callback) => {
    callback(null, "images");
    //null pour dire y'a pas d'erreur
  },
  filename: (req, file, callback) => {
    const nam = file.originalname.split(" ").join("_");
    const name = nam.split(".")[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name+"-" + Date.now() + "." + extension);
  },
});
//veut dire qu'un seul fichier de type image 
module.exports = multer({ storage: storage }).single("image");
