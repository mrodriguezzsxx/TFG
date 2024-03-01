const Curso = require("../models/curso");
const fs = require("fs");
const path = require("path");

const crearCurso = async (req, res) => {
  const { title, description, category, price } = req.body;
  const idInstructor = req.user.id;

  if (!title || !description || !category || !price) {
    return res.status(400).send({
      status: "error",
      message: "Falta completar todos los campos del curso",
    });
  }

  try {
    const { imagen, video, pdf } = req.files;

    if (!imagen || !video || !pdf) {
      return res.status(404).send({
        status: "error",
        message: "No se ha seleccionado ninguna imagen, video o documentacion",
      });
    }

    const extensionImagen = imagen[0].originalname.split('.');

    const extensionVideo = video[0].originalname.split('.');

    const extensionPdf = pdf[0].originalname.split('.');


    if(extensionImagen[1] != "png" && extensionImagen[1] != "jpg" && extensionImagen[1] != "jpeg") {
        
        return res.status(404).send({
            status: "error",
            message: "Extension de fichero invalida"
          });

    }else if(extensionVideo[1] != "mp4" && extensionImagen[1] != "avi" && extensionImagen[1] != "vlc") {
        return res.status(404).send({
          status: "error",
          message: "Extension de video invalida"
        });
    }else if(extensionPdf[1] != "pdf") {
        return res.status(404).send({ 
          status: "error",
          message: "Necesitas subir un fichero pdf"
        });
    }

    const curso = new Curso({
      title,
      description,
      category,
      price,
      image: imagen[0].filename,
      video: video[0].filename,
      pdf: pdf[0].filename,
      idInstructor,
    });

    await curso.save();

    return res.status(200).send({
      status: "success",
      message: "Curso creado correctamente",
      curso,
    });
  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).send({
        status: "error",
        message: "Este título de curso ya existe",
      });
    }

    return res.status(500).send({
      status: "error",
      message: "Error en la creación del curso",
    });
  }
};

const mostrarCursos = async(req, res) =>{
    try{
        const cursos = await Curso.find();
        return res.status(200).send({
            status: "success",
            message: "Estos son los cursos",
            cursos
        })
    }catch(error){
        return res.status(500).send({
            status : "error",
            message: "Error al buscar los cursos" 
        }) ;
    }
}

const mostrarCurso = async(req, res) =>{
  const idCurso = req.params.id;
  try{
      const curso = await Curso.findById(idCurso).populate("idInstructor", "-password -created_at -estado -rol -__v");
      return res.status(200).send({
          status: "success",
          message: "Este es el curso",
          curso
      })
  }catch(error){
      return res.status(500).send({
          status : "error",
          message: "Error al buscar el curso" 
      });
  }
}

const visualizarImagen = async(req, res) => {
  const file = req.params.file;

  const filePath = "./uploads/cursos/"+file;

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
const visualizarDocs = async(req, res) => {
  const file = req.params.file;

  const filePath = "./uploads/docs/"+file;

  fs.stat(filePath, (error, exists) => {

      if(!exists) {
          return res.status(404).send({
              status: "error",
              message: "No existe documentos subidos"
          })
      }

      // Devolver un file
      return res.sendFile(path.resolve(filePath));
  })
}
const visualizarVideo = async(req, res) => {
  const file = req.params.file;

  const filePath = "./uploads/videos/"+file;

  fs.stat(filePath, (error, exists) => {

      if(!exists) {
          return res.status(404).send({
              status: "error",
              message: "No existe un video"
          })
      }

      // Devolver un file
      return res.sendFile(path.resolve(filePath));
  })
}

const añadirComentario = async (req, res) => {
  const idCurso = req.params.id;
  const userId = req.user.id;
  const { texto } = req.body;

  try {
    const curso = await Curso.findById(idCurso);

    if (!curso) {
      return res.status(404).send({
        status: "error",
        message: "El curso no existe"
      });
    }

    const comentario = {
      user: userId,
      texto,
      created_at: new Date()
    };

    curso.comentarios.push(comentario);

    // Ordenar los comentarios por el campo created_at de forma descendente
    curso.comentarios.sort((a, b) => b.created_at - a.created_at);

    await curso.save();

    return res.status(200).send({
      status: "success",
      message: "Comentario añadido correctamente",
      comentario
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al añadir el comentario"
    });
  }
};

const mostrarComentarios = async (req, res) => {
  const idCurso = req.params.id;

  try {
    const curso = await Curso.findById(idCurso).populate("comentarios.user", "name image");

    if (!curso) {
      return res.status(404).send({
        status: "error",
        message: "El curso no existe"
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Comentarios obtenidos correctamente",
      comentarios: curso.comentarios
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al obtener los comentarios"
    });
  }
};

const eliminarComentario = async(req, res) => {
  const idCurso = req.params.idCurso;
  const idComentario = req.params.idComentario;

  try {
    const curso = await Curso.findById(idCurso);

    if (!curso) {
      return res.status(404).send({
        status: "error",
        message: "El curso no existe"
      });
    }

    const comentario = curso.comentarios.find(c => c._id.toString() === idComentario);

    if (!comentario) {
      return res.status(404).send({
        status: "error",
        message: "El comentario no existe"
      });
    }

    // Verificar la autorización y cualquier otra lógica necesaria antes de eliminar el comentario

    curso.comentarios = curso.comentarios.filter(c => c._id.toString() !== idComentario);
    await curso.save();

    return res.status(200).send({
      status: "success",
      message: "Comentario eliminado correctamente"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al eliminar el comentario"
    });
  }
}

const añadirRating = async (req, res) => {
  const idCurso = req.params.id;
  const userId = req.user.id;
  const { rating } = req.body;

  try {
    const curso = await Curso.findById(idCurso);

    if (!curso) {
      return res.status(404).send({
        status: "error",
        message: "El curso no existe"
      });
    }

    const ratingExistenteIndex = curso.rating.findIndex(r => r.user.toString() === userId.toString());

    if (ratingExistenteIndex !== -1) {
      curso.rating[ratingExistenteIndex].rating = rating;
    } else {
      curso.rating.push({ user: userId, rating });
    }

    await curso.save();

    const totalRating = curso.rating.length;
    let suma = 0;

    for (let i = 0; i < totalRating; i++) {
      suma += curso.rating[i].rating;
    }

    let ratingPromedio = suma / totalRating;
    
    curso.ratingPromedio = ratingPromedio;

    await curso.save();

    console.log(ratingPromedio);
    console.log(suma);

    return res.status(200).send({
      status: "success",
      message: "Rating añadido correctamente",
      rating: curso.rating
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al añadir el rating de ese usuario"
    });
  }
}

const obtenerRating = async (req, res) => {
  const idCurso = req.params.id;
  const userId = req.user.id;

  try {
    const curso = await Curso.findById(idCurso);

    if (!curso) {
      return res.status(404).send({
        status: "error",
        message: "El curso no existe",
      });
    }

    const ratingExistente = curso.rating.find(
      (r) => r.user.toString() === userId.toString()
    );

    let rating = 0;

    if (ratingExistente) {
      rating = ratingExistente.rating;
    }

    return res.status(200).send({
      status: "success",
      message: "Rating obtenido correctamente",
      rating: rating,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al obtener el rating del usuario",
    });
  }
};

module.exports = {
    crearCurso,
    mostrarCursos,
    mostrarCurso,
    visualizarImagen,
    visualizarDocs,
    visualizarVideo,
    añadirComentario,
    mostrarComentarios,
    eliminarComentario,
    añadirRating,
    obtenerRating
};

