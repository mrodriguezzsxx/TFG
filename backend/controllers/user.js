// Importar Dependencias
const bcrypt = require("bcrypt"); // Encryptar contraseña
const jwt = require("../services/jwt"); // LLamar a mi token
const fs = require("fs");
const path = require("path");
// Importar modelos
const User = require("../models/user");
const Pendiente = require("../models/instructorPendiente");

// Metodo para registrar usuarios
const registrar = async(req, res) => {
    // Se obtiene la peticion que se pasa en el body
    const params = req.body;

    // En caso de que no se rellene ciertos campos
    if(!params.name || !params.email || !params.password || !params.rol) {
        return res.status(400).send({
            status: "error",
            message: "Falta rellenar los campos"
        })
    }

    // Instructor de bloque en caso de errores o no
    try {

        // Contraseña encryptada y guardarlo en una variable
        // Se espera una respuesta, por lo tanto se utiliza el async await
        let pwd = await bcrypt.hash(params.password, 10);
        // Guardar contraseña encryptada dentro de la contraseña que se pasa por el body
        params.password = pwd;

        // Almacenar todos los datos dentro del modelo User
        let users = new User(params);

        // En caso de asignar el rol instructor
        if(params.rol == "instructor") {
            // asignarle el estado en inactivo en el modelo User
            params.estado = "inactivo";

            // Almacenar los datos del instructor en el modelo User
            users = new User(params);

            // En caso de que no se haga la propuesta
            if(!params.propuesta) {
                // Devolver una respuesta de estado 400
                return res.status(400).send({
                    status: "error",
                    message: "Falta proporcionar los datos del instructor"
                })
            }
            // En caso de no incluir un archivo
            if(!req.file) {
                // Devolver una respuesta de estado 404
                return res.status(404).send({
                    status: "error",
                    message: "No se ha enviado ningun archivo"
                })
            }
            // Obtener el nombre del fichero que se almacena
            let curriculum = req.file.filename;

            // Por una parte, almacenar los datos del instructor pendiente
            // el id_usuario que se crea en el modelo User, el curriculum, 
            // propuesta, y el estado en pendiente
            let instructor_pendiente = new Pendiente({
                id_usuario: users._id,
                curriculum: curriculum,
                propuesta: params.propuesta,
                estado: "Pendiente"
            });

            // Guardar el instructor pendiente en el modelo
            let pendiente_stored = await instructor_pendiente.save();

            // Guardar todos los datos del instructor en el otro modelo
            let instructor_stored = await users.save();
            
            // Devolver respuesta con estado 200
            // Tanto el objeto del instructor que esta en pendiente como 
            // todo el objeto con los datos del instructor
            return res.status(200).send({
                status: "success",
                pendiente: pendiente_stored,
                instructor: instructor_stored
            })

        }

        // Guardar los datos del usuario estudiante en el modelo
        let user_to_stored = await users.save();
        // Devolver respuesta con estado 200
        return res.status(200).send({
            status: "success",
            message: "Se ha registrado correctamente",
            user: user_to_stored
        })

    // En caso de que haya algun error
    }catch(error) {
        console.log(error);
        // Si sale el error de codigo 11000, significa que hay alguna clave 
        //repetida en la BBDD y no dejara crear ese usuario con esos datos
        if(error.code === 11000) {
            return res.status(400).send({
                status: "error",
                message: "El email ya esta registrado"
            })
        }
        // En caso de que falle al crear un usuario
        return res.status(500).send({
            status: "error",
            message: "Ha ocurrido un error en la creación de un usuario"
        })
    }
}

// Metodo para loguearte
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
                message: "Email o Nick incorrecto"
            })
        }

        if(users.estado === "inactivo") {
            return res.status(400).send({
                status: "error",
                message: "Instructor Inactivo"
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

    // En caso de que haya algun error en el servidor
    }catch(error) {
        // Devolver respuesta de estado 500
        return res.status(500).send({
            status: "error",
            message: "Ha ocurrido un error al intentar iniciar sesión"
        }) 
    }
}

const profile = async(req, res) => {

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

const update = async(req, res) => {

    let userIdentity = req.user;
    let userUpdate = req.body;

    try {

        delete userUpdate.iat;
        delete userUpdate.exp;
        delete userUpdate.rol;
        delete userUpdate.image;

        if(userUpdate.password) {
            let pwd = await bcrypt.hash(userUpdate.password, 10);
            userUpdate.password = pwd;
        }else {
            delete userUpdate.password;
        }

        let update = await User.findByIdAndUpdate(userIdentity.id, userUpdate, {new: true});

        return res.status(200).send({
            status: "success",
            message: "Usuario actualizado",
            user: update
        })

    }catch(error) {
        console.log(error);
        return res.status(500).send({
            status: "success",
            message: "Usuario actualizado",
            user: update
        })
    }
}

const upload = async(req, res) => {

    try {

        if(!req.file) {
            return res.status(404).send({
                status: "error",
                message: "Peticion no incluye imagen"
            })
        }

        let image = req.file.originalname;
        
        const imageSplit = image.split("\.");
        const extension = imageSplit[1];

        if(extension != "png" && extension != "jpg" && extension != "jpeg") {
            
            const filePath = req.file.path;
            const fileDeleted = fs.unlinkSync(filePath);

            return res.status(400).send({
                status: "error",
                message: "Extension valida (png - jpg - jpeg)"
            })
        }

        const userUpdated = await User.findByIdAndUpdate({_id: req.user.id}, {image: req.file.filename}, {new: true});

        return res.status(200).send({
            status: "success",
            user: userUpdated,
            file: req.file
        })
    }catch(error) {
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: "Error en la subida del avatar"
        })
    }
}

const avatar = (req, res) => {
    const file = req.params.file;

    const filePath = "./uploads/avatars/"+file;

    fs.stat(filePath, (error, exists) => {

        if(!exists) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen"
            })
        }

        // Devolver un file
        return res.sendFile(path.resolve(filePath));
    })
}

const mostrarCurriculum = async(req, res) => {
    const file = req.params.file;

    const filePath = "./uploads/curriculums/"+file;

    fs.stat(filePath, (error, exists) => {

        if(!exists) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen"
            })
        }

        // Devolver un file
        return res.sendFile(path.resolve(filePath));
    })
}
// Exportar los modulos registrar y el login
module.exports = {
    registrar,
    login,
    profile,
    update,
    upload,
    avatar,
    mostrarCurriculum
}