const jwt = require("jwt-simple");
const moment = require("moment");

const libjwt = require("../services/jwt");
const clave_secreta = libjwt.clave_secreta;

exports.auth = (req, res, next) => {

    if(!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "La peticion no tiene la cabecera de autentificación"
        })
    }

    let token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        let payload = jwt.decode(token, clave_secreta);

        if(payload.exp <= moment().unix()) {
            return res.status(401).send({
                status: "error",
                message: "token invalido",
                error
            })
        }

        req.user = payload;


    }catch(error) {
        return res.status(404).send({
            status: "error",
            message: "token invalido"
        })
    }

    next();
}

