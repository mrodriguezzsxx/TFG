import React from 'react'
import Header from "../layout/Header"
import useForm from '../../hooks/useForm'
import Swal from 'sweetalert2';
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Global } from "../../helpers/Global"
import '../../assets/css/cursos/crearCurso.css'
import videos from '../../assets/img/video.png'
import archivo from '../../assets/img/archivo.png'
import imagen from '../../assets/img/image.png'

const CrearCursos = () => {

  const { form, changed } = useForm({});
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [video, setVideo] = useState(null);

  let navigate = useNavigate();
  const enviarCurso = async (e) => {
    e.preventDefault();

    const formCurso = form;
    const token = localStorage.getItem("token");

    const formData = new FormData();
    for (let campo in formCurso) {
      formData.append(campo, formCurso[campo]);
    }

    formData.append("imagen", image);
    formData.append("video", video);
    formData.append("pdf", file);

    const request = await fetch(Global.urlCursos + "crear-curso", {
      method: 'POST',
      body: formData,
      headers: {
        "Authorization": token
      }
    });

    console.log("Tamaño de la imagen:", image ? image.size : 0, "bytes");
    console.log("Tamaño del archivo:", file ? file.size : 0, "bytes");
    console.log("Tamaño del video:", video ? video.size : 0, "bytes");

    console.log(formData);
    console.log(formCurso);
    const datos = await request.json();
    
    console.log(datos);
    if (datos.status == "success") {
      Swal.fire({
        title: datos.message,
        icon: datos.status,
        timer: 2000
      });
      setTimeout(() => {
        navigate("/cursos");
      }, [2000]);
    } else {
      console.log(datos);
      Swal.fire({
        title: datos.message,
        icon: datos.status,
        timer: 2000
      });
    }

  }

  return (
    <div>
      <Header />
      <div className="crearCurso">
        <form className="formCurso">
          <div className='containerGeneral'>
            <div className='containerIzq'>
              <label htmlFor="nombreCurso">Nombre del Curso: *</label>
              <input type="text" name="title" onChange={changed} required />
              <label htmlFor="description">Descripcion: *</label>
              <textarea name='description'  onChange={changed} required />
              <label htmlFor="categorias">Categoria: *</label>
              <select name='category' className='categorias' required defaultValue="" onChange={changed} >
                <option value="">Selecciona Categoria</option>
                <option value="Deportes">Deportes</option>
                <option value="Videojuegos">Videojuegos</option>
                <option value="Musica">Música</option>
                <option value="Comida">Comida</option>
                <option value="Programacion">Programación</option>
                <option value="Idiomas">Idiomas</option>
              </select>
              <label htmlFor='precio'>Precio: *</label>
              <input type='number' name='price' onChange={changed} required />
              <label htmlFor="githun">Github:</label>
              <input type="text" name="github" onChange={changed}  />
              <div className="guardar">
                <input type="submit" value='GUARDAR' onClick={enviarCurso} />
              </div>
            </div>

            <div className='containerDer'>
              <div className='containerImg'>
                <img src={imagen} />
              </div>
              <div className="container-input">
                <input type="file" name="imagen" id="file-1" onChange={(e) => setImage(e.target.files[0])} className="inputfile inputfile-1" accept="image/jpeg, image/png, image/jpg"  data-multiple-caption="{count} archivos seleccionados" multiple/>
                <label htmlFor="file-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="iborrainputfile" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                  <span className="iborrainputfile">IMPORTAR IMAGEN</span>
                </label>
              </div>
              <div className='containerImg'>
                <img src={archivo} />
              </div>
              <div className="container-input">
                <input type="file" name="pdf" id="file-2" onChange={(e) => setFile(e.target.files[0])} accept=".pdf" className="inputfile inputfile-1" data-multiple-caption="{count} archivos seleccionados"/>
                <label htmlFor="file-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="iborrainputfile" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                  <span className="iborrainputfile">IMPORTAR ARCHIVO</span>
                </label>
              </div>
              <div className='containerImg'>
                <img src={videos} />
              </div>
              <div className="container-input">
                <input type="file" name="video" id="file-3" onChange={(e) => setVideo(e.target.files[0])} accept="video/mp4, video/avi, video/x-flv" className="inputfile inputfile-1" data-multiple-caption="{count} archivos seleccionados" multiple/>
                <label htmlFor="file-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="iborrainputfile" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                  <span className="iborrainputfile">IMPORTAR VIDEO</span>
                </label>
              </div>
              <div className='progesionArchivos'>

              </div>
            </div>
          </div>
        </form>
      </div >
    </div>
  )

}



export default CrearCursos