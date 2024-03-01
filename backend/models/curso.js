const {Schema, model} = require("mongoose");

// Estructura de mi esquema/modelo del Usuario
const SchemaCurso = Schema({
    title: {
        type: String,
        unique: true,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    rating: [{
        user: {
            type: Schema.ObjectId,
            ref: "User"   
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
        },
    }],
    ratingPromedio: [{
        type: Number,
        default: 0
    }],
    idInstructor:{
        type: Schema.Types.ObjectId,
        ref: "User"   
    },
    category: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    comentarios: [{
        user: {
            type: Schema.ObjectId,
            ref: "User"   
        },
        texto: {
            type: String
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    }],
    video: {
        type: String,
        require: true 
    },
    pdf: {
        type: String,
        require: true
    },
    create_at: {
        type: Date,
        default: Date.now
    },
})

// Exportar el modelo
module.exports = model("Curso", SchemaCurso, "curso");