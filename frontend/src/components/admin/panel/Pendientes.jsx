import React, { useEffect, useState } from 'react'
import Header from './Header'
import { Global } from '../../../helpers/Global'
import defaults from '../../../assets/img/defaults.png';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Pendientes = () => {

  const [instructoresPendientes, setInstructores] = useState([]);
  const [idInstructorSeleccionado, setInstructorSeleccionado] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    listPendientes();
  }, []);
  
  const listPendientes = async() => {
    const request = await fetch(Global.urlAdmin + "list-pendientes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    })

    const datos = await request.json();
    setInstructores(datos);
  }

  const Aceptado = async(usuario) => {
    const request = await fetch(Global.urlAdmin + "pendiente", {
      method: "POST",
      body: JSON.stringify({
        id_usuario: usuario.id_usuario._id,
        estado: "Aceptar"
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })
  
    const datos = await request.json();
  
    if(datos.status == "success") {
      Swal.fire({
        title: datos.message,
        icon: datos.status,
        timer: 2000
      }).then(() => {
        const filteredUsuarios = instructoresPendientes.pendientes.filter(instructor => instructor.id_usuario._id !== usuario.id_usuario._id );
        setInstructores({
          ...instructoresPendientes,
          pendientes: filteredUsuarios
        });
      });
  
    }else {
      Swal.fire({
        title: datos.message,
        icon: datos.status,
        timer: 2000
      });
    }
  }
  

  const Rechazar = async(usuario) => {
    const request = await fetch(Global.urlAdmin + "pendiente", {
      method: "POST",
      body: JSON.stringify({
        id_usuario: usuario.id_usuario._id,
        estado: "Rechazar"
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })

    const datos = await request.json();

    if(datos.status === "success") {

      Swal.fire({
        title: datos.message,
        icon: datos.status,
        timer: 2000
      }).then(() => {
        const filteredUsuarios = instructoresPendientes.pendientes.filter(instructor => instructor.id_usuario._id !== usuario.id_usuario._id );
        setInstructores({
          ...instructoresPendientes,
          pendientes: filteredUsuarios
        });
      });
    }else{
      Swal.fire({
        title: datos.message,
        icon: datos.status,
        timer: 2000
      });
    }
  }

  const confirmarAceptar = (usuario) => {
    Swal.fire({
      title: '¿Está seguro de que desea aceptar este instructor?',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        Aceptado(usuario);
      }
    })
  }

  const confirmarRechazar = (usuario) => {
    Swal.fire({
      title: '¿Está seguro de que desea rechazar este instructor?',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        Rechazar(usuario);
      }
    })
  }

  const navigate = useNavigate();
  const solicitud = (usuario) => {
      navigate("curriculum/" + usuario.id_usuario._id);

      setInstructorSeleccionado(usuario.id_usuario._id);
  }
  return (
    <div>
        <Header />
        <div className='usuariosRol'>
        <table className='table'>
          <thead>
            <tr>
              <th>Imagen de Perfil</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {instructoresPendientes.pendientes && instructoresPendientes.pendientes.map((usuario) => (
              <tr key={usuario._id}>
                <td>
                  <img src={defaults} />
                </td>
                <td>{usuario.id_usuario.name}</td>
                <td>{usuario.estado}</td>
                <td className='acciones'>
                  <button onClick={() => solicitud(usuario)}>Solicitud</button>
                  <button onClick={() => confirmarAceptar(usuario)}>Aceptar</button>
                  <button onClick={() => confirmarRechazar(usuario)}>Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Pendientes