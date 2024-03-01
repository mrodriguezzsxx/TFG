import React, { useState } from 'react'
import '../../assets/css/registro/registro.css'
import useForm from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

const Registro = () => {
  const [popUp, setPopUp] = useState(false);
  const { form, changed } = useForm({});
  const [file, setFile] = useState(null);
  const [instructorDato, setInstructorDato] = useState({ "curriculum": '', "propuesta": '' });

  const navigate = useNavigate();
  const enviarDatos = async (e) => {
    e.preventDefault();
    const formUser = form;

    const formData = new FormData();
    for (let campo in formUser) {
      formData.append(campo, formUser[campo]);
    }

    formData.append("curriculum", file);

    if (form.rol !== "instructor") {
      const request = await fetch(Global.url + "registrar", {
        method: 'POST',
        body: formData
      });
      const datos = await request.json();

      if (datos.status === "success") {
        Swal.fire({
          title: datos.message,
          icon: datos.status,
          timer: 2000
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        Swal.fire({
          title: datos.message,
          icon: datos.status,
          timer: 2000
        });
      }
    } else {
      setPopUp(true);
      if (popUp) {
        let extension = file?file.name.split('.')[1]:null
        if (extension == "pdf") {
          const request = await fetch(Global.url + "registrar", {
            method: 'POST',
            body: formData
          });
          const datos = await request.json();

          if (datos.status == "success") {

            Swal.fire({
              title: "Instructor en estado Pendiente",
              icon: datos.status,
              timer: 2000
            })

            setTimeout(() => {
              navigate("/login");
            }, 2000);

          } else {
            Swal.fire({
              title: datos.message,
              icon: datos.status,
              timer: 2000
            })
          }

        } else if (file == null) {
          Swal.fire({
            icon: 'error',
            title: 'Falta importar el archivo',
            timer: 2000
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Solo se aceptan ficheros con extension PDF',
            timer: 2000
          })
        }
      }
    }
  }

  const cerrarPopup = () => {
    setPopUp(false);
  }

  return (

    <div className='containerSignUp'>
      <div className='signup'>
        <h1>REGISTRARSE</h1>
        <form onSubmit={enviarDatos}>
          <div className='roles'>
            <input type='radio' id='estudiante' value='estudiante' name='rol' onChange={changed} />
            <label htmlFor='estudiante'>Estudiante</label>
            <input type='radio' id='instructor' value='instructor' name='rol' onChange={changed} />
            <label htmlFor='instructor'>Instructor</label>
          </div>
          <div className='camposRegistro'>
            <input type='text' placeholder='Nombre' name="name" onChange={changed} />
            <input type='email' placeholder='E-Mail' name='email' onChange={changed} />
            <input type='password' placeholder='Contraseña' name='password' onChange={changed} />
          </div>
          <div className='terminos'>
            <input type='checkbox' required />
            <label htmlFor='terminos'>acceptar terminos y codiciones</label>
          </div>
          <div className='crearCuenta'>
            <input type='submit' value='CREATE ACCOUNT' />
          </div>
          <div className='tienesCuenta'>
            <p>Ya tienes cuenta? <Link to='../login'>Inicia Sesión</Link> </p>
          </div>
        </form>
        {popUp && (
          <div className='popUp'>
            <div className='exit'>
              <p className='cerrarPopup' onClick={cerrarPopup}>X</p>
            </div>
            <form onSubmit={enviarDatos}>
              <h4>Completa la Información</h4>
              <div className='camposPopUp'>
                <div className="container-input">
                  <input type="file" name="curriculum" id="file-1" onChange={(e) => setFile(e.target.files[0])} className="inputfile inputfile-1" accept='application/pdf' data-multiple-caption="{count} archivos seleccionados" multiple />
                  <label htmlFor="file-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="iborrainputfile" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                    <span className="iborrainputfile">CURRICULUM</span>
                  </label>
                </div>
                <textarea name='propuesta' placeholder='¿Propuesta?' onChange={changed} />
              </div>
              <div className='enviar'>
                <input type='submit' value='ENVIAR' />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Registro;