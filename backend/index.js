// Importar el archivo de conexión
const connection = require("./database/connection");
// Importar dependencias express y cors
const express = require("express");
const cors = require("cors");
// Llamar a la funcion connection() para conectarse a la BBDD
connection();
console.log("API ARRANCADA");

const app = express();
const puerto = 3900; // Definir puerto en el 3900

// Iniciar mi app para que utilize los cors(), y pasar el express en json y por ultimo definir que pasaremos todo por el urlencoded que estaa en el postman dentro del body
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Importar mi archivo de rutas del User
const User = require("./routes/user");
const Admin = require("./routes/admin");
const Curso = require("./routes/curso");
// Iniciar mi API en el /api
app.use("/api", User);
app.use("/admin", Admin);
app.use("/cursos", Curso)
// Escuchar mi servidor en el puerto 3900
app.listen(puerto, function() {
    console.log("Servidor en el puerto: ", puerto );
})