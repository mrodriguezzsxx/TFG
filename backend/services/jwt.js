// Importar dependencias del jwt y el momento para el token
const jwt = require("jwt-simple");
const moment = require("moment");

// Crear la clave secreta del token
const clave_secreta = "ESTa_ES_LaClave_SecRETa_De_MI_AplIcACion";
// Crear el Token donde se pasa los datos del usuario en el parametro
const createToken = (user) => {
    // Guardar los datos que queremos dentro del payload
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        rol: user.rol,
        image: user.image,
        iat: moment().unix(), // Guardar la fecha que se creo el token
        exp: moment().add(30, "days").unix() // Y la fecha de validación
    }

    // Retornar el token
    return jwt.encode(payload, clave_secreta);;
}

// Exportar los modulos de la funcion createToken y la clave secreta
module.exports = {
    createToken,
    clave_secreta
}