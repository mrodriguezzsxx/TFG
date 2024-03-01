const {Schema, model} = require("mongoose");

// Estructura de mi esquema/modelo del Instructor Pendiente
const pendienteSchema = Schema({
    id_usuario: {
        type: Schema.ObjectId,
        ref: "User"
    },
    curriculum: {
        type: String,
        require: true
    },
    propuesta: {
        type: String,
        require: true
    },
    estado: {
        type: String,
        enum: ["Pendiente","Aceptar","Rechazar"],
        default: "Pendiente"
    }
})

module.exports = model("Pendiente", pendienteSchema, "pendiente");