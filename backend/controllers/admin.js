const User = require("../models/user");
const Pendiente = require("../models/instructorPendiente");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");

const login = async(req, res) => {
     // Se obtiene la peticion que se pasa en el body
     let params = req.body;

     // En caso de que no se rellene ciertos campos 
     if(!params.email || !params.password) {
         // Devolver respuesta
         return res.status(400).send({
             status: "error",
             message: "Falta rellenar los campos"
         })
     }
 
     // Instrucción de Bloque en caso de que haya algun error en el servidor
     try {
 
         // Se busca en el modelo User si hay el email o el nick almacenado
         let users = await User.findOne({
             $or: [
                 {email: params.email}
             ]
         })
 
         // En caso de que el email o el nick sean incorrectos
         if(!users) {
             return res.status(400).send({
                 status: "error",
                 message: "No se encontró ningun usuario con los datos proporcionados"
             })
         }

        // Comparamos la contraseña que se pasa en el body con la 
         // contraseña encryptada
         let pwd = bcrypt.compareSync(params.password, users.password);
         // En caso de que la contraseña sea incorrecta
         if(!pwd) {
             return res.status(400).send({
                 status: "error",
                 message: "Contraseña Incorrecta"
             })
         }

        // Llamar al metodo donde se crea el token del usuario y pasarle
         // todos los datos de users
         let token = jwt.createToken(users);
 
         if(users.rol === "administrador") {
 
         // Devolver respuesta del usuario + el token
         return res.status(200).send({
             status: "success",
             message: "Se ha logueado correctamente",
             user: {
                 id: users.id,
                 name: users.name
             },
             token
         })
         }else {
            // Devolver respuesta del usuario + el token
         return res.status(400).send({
            status: "error",
            message: "No tienes acceso"
        })
         }
 
 
     // En caso de que haya algun error en el servidor
     }catch(error) {
         // Devolver respuesta de estado 500
         return res.status(500).send({
             status: "error",
             message: "Ha ocurrido un error al intentar iniciar sesión"
         }) 
     }
}

const profileAdmin = async(req, res) => {

    const id = req.params.id;

    try {
        const userProfile = await User.findById(id).select("-password");

        if(!userProfile) {
            return res.status(400).send({
                status: "error",
                message: "NO se ha encontrado el usuario con ese id",
            })
        }
        return res.status(200).send({
            status: "success",
            message: "Usuario encontrado",
            user: userProfile
        })
    }catch(error) {
        return res.status(500).send({
            status: "error",
            message: "Ha ocurrido un error al buscar el usuario"
        })
    }
}
const listUsuarios = async(req, res) => {

    try {

        const estudiantesCount = await User.countDocuments({rol: "estudiante"});
        const instructoresCount = await User.countDocuments({rol: "instructor"});
        const estudiantes = await User.find({rol: "estudiante"}).select("-password");
        const instructores = await User.find({rol: "instructor"}).select("-password");

        return res.status(200).send({
            status: "success",
            message: "Lista de usuarios",
            estudiantes: estudiantes,
            instructores: instructores,
            estudiantesCount,
            instructoresCount
        })
    }catch(error) {
        return res.status(500).send({
            status: "error",
            message: "Ha ocurrido un error al listar los usuarios"
        })
    }
}
const pendiente = async(req, res) => {

    try {

        const {id_usuario, estado} = req.body;
        const instructor = await Pendiente.findOne({id_usuario});

        if(!instructor) {
            return res.status(404).send({
                status: "error",
                message: "No se encontró un instructor con el ID especificado"
            })
        }

        instructor.estado = estado;

        if(estado === "Aceptar") {
            const usuario = await User.findByIdAndUpdate(
                id_usuario,
                {estado: estado === "Aceptar" ? "Activo" : "Inactivo"}
            )

            await Pendiente.findByIdAndDelete(instructor._id);

            return res.status(200).send({
                status: "success",
                message: "Solicitud del instructor aceptada correctamente",
                usuario
            })
        }else if(estado === "Rechazar") {
            await Pendiente.findByIdAndUpdate(instructor._id);
            await Pendiente.findByIdAndDelete(instructor._id);
            await User.findByIdAndDelete(id_usuario);
            return res.status(200).send({
                status: "success",
                message: "Estado del instructor rechazada y usuario eliminado correctamente"
            })

        }else {
            instructor.estado = estado;
            const pendienteActualizado = await instructor.save();

            return res.status(200).send({
                status: "success",
                message: "Estado del instructor actualizado correctamente",
                instructor: pendienteActualizado,
                usuario
            })
        }

    }catch(error) {
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: "Ha ocurrido un error al actualizar el instructor"
        })

    }
}

const listPendientes = async(req, res) => {

    try {

        const pendientes = await Pendiente.find({estado:"Pendiente"}).populate("id_usuario");

        return res.status(200).send({
            status: "success",
            message: "Instructores Pendientes",
            pendientes
        })
    }catch(error) {
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: "Ha ocurrido un error al buscar todos los instructores pendientes"
        })
    }
}

const listPendiente = async(req, res) => {

    const id_usuario = req.params.id;

    try {
        const pendiente = await Pendiente.findOne({id_usuario}).populate("id_usuario", "-password -created_at -image");

        return res.status(200).send({
            status: "success",
            message: "Instructor Pendiente",
            pendiente
        })
    }catch(error) {
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: "Ha ocurrido un error al buscar el instructor pendiente"
        })

    }
}

module.exports = {
    login,
    profileAdmin,
    listUsuarios,
    pendiente,
    listPendientes,
    listPendiente
}