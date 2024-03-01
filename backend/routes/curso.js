// Definir dependencias de express para declarar las rutas de mi API
const express = require("express");
const app = express();
const check = require("../middleware/auth");
// Importar el modelo curso
const Curso = require("../controllers/curso")

// Dependencia para la subida de archivos
const multer = require("multer");

// Dentro del storage, definir el multer y guardarlo dentro de mi disco en la ruta que se le pasa "./uploads/curriculums/"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "imagen") {
            cb(null, "./uploads/cursos/");
        } else if (file.fieldname === "video") {
            cb(null, "./uploads/videos/");
        }else if(file.fieldname === "pdf") {
            cb(null, "./uploads/docs/");
        }
    },
    // El nombre del archivo se guarda con la estructura como "curriculum" y la fecha en la que se crea "-" y el nombre del archivo 
    filename: (req, file, cb) => {
        const fileName = `${file.fieldname}-${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
})
const upload = multer({storage});

app.get("/mostrar-cursos", Curso.mostrarCursos)
app.get("/mostrar-curso/:id", Curso.mostrarCurso)
app.post("/crear-curso", [check.auth, upload.fields([{ name: "imagen" }, { name: "video" }, {name: "pdf"}])], Curso.crearCurso)
app.get("/visualizar-imagen/:file", Curso.visualizarImagen);
app.get("/visualizar-docs/:file", Curso.visualizarDocs);
app.get("/visualizar-video/:file", Curso.visualizarVideo);
app.post("/comentario/:id", check.auth, Curso.añadirComentario);
app.get('/comentarios/:id', Curso.mostrarComentarios);
app.delete('/:idCurso/comentario/:idComentario', Curso.eliminarComentario);
app.post("/rating/:id", check.auth, Curso.añadirRating);
app.get('/rating/:id', check.auth, Curso.obtenerRating);


// Exportar el modulo app
module.exports = app; 