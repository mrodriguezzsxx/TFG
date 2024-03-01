// Llamar a mi controlador User
const User = require("../controllers/user");
const check = require("../middleware/auth");
// Definir dependencias de express para declarar las rutas de mi API
const express = require("express");
const app = express();
// Dependencia para la subida de archivos
const multer = require("multer");

// Dentro del storage, definir el multer y guardarlo dentro de mi disco en la ruta que se le pasa "./uploads/curriculums/"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/curriculums/");
    },
    // El nombre del archivo se guarda con la estructura como "curriculum" y la fecha en la que se crea "-" y el nombre del archivo 
    filename: (req, file, cb) => {
        cb(null, "curriculum-"+Date.now()+"-"+file.originalname);
    }
})

// Guardarlo dentro del multer en una variable uploads
const uploads = multer({storage});

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars/");
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-"+Date.now()+"-"+file.originalname);
    }
})

const uploads2 = multer({
    storage: storage2
})

// Definir rutas del registro y el login
app.post("/registrar", uploads.single("curriculum"), User.registrar);
app.post("/login", User.login);
app.get("/profile/:id", check.auth, User.profile);
app.put("/update", check.auth, User.update);
app.post("/upload", [check.auth, uploads2.single("file0")], User.upload);
app.get("/avatar/:file", User.avatar);
app.get("/mostrarCurriculum/:file", User.mostrarCurriculum);
// Exportar el modulo app
module.exports = app;