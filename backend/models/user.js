const {Schema, model} = require("mongoose");

// Estructura de mi esquema/modelo del Usuario
const SchemaUser = Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    rol: {
        type: String,
        enum: ["estudiante", "instructor", "administrador"],
        require: true
    },
    image: {
        type: String,
        default: "default.png"
    },
    estado: {
        type: String,
        enum: ["activo", "inactivo"],
        default: "activo"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

// Exportar el modelo
module.exports = model("User", SchemaUser, "user");