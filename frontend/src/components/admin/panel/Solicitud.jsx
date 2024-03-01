import React, { useEffect, useState } from 'react'
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/admin/usuarios/instructoresPendientes.css';
import { Global } from '../../../helpers/Global';
const Solicitud = () => {

    const [instructor, setInstructores] = useState(null);
    const [curriculum, setCurriculum] = useState(null);

    const idInstructor = window.location.pathname.split('/')[5];
    
    const token = localStorage.getItem("token");

    useEffect(() => {
        obtenerInstructor();
    }, [idInstructor]);

    useEffect(() => {
        if(instructor !== null) {
            obtenerCurriculum();
        }
    }, [instructor]);

    const obtenerInstructor = async() => {
        const request = await fetch(Global.urlAdmin + "list-pendiente/" + idInstructor, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        const datos = await request.json();
        setInstructores(datos);
    }
    const navigate = useNavigate();

    const obtenerCurriculum = async() => {
        const idCurriculum = instructor.pendiente.curriculum;

        const request = await fetch(Global.url + "mostrarCurriculum/" + idCurriculum , {
            method: "GET",
            headers: {
                "Content-Type": "application/pdf",
            }
        })

        const datos = await request.blob();
        setCurriculum(URL.createObjectURL(datos));
        
    }

  return (
    <div>
        <Header />
        <div className='borde-curriculum'>
            {instructor && instructor.pendiente &&
            <div className='curriculum'>
                <div className='linea'></div>
                <div className="linea"></div>
                <div className="linea"></div>
                <div className="linea"></div>
                <div className='informacion'>
                    <h2>Información del Instructor</h2>
                    <p><span>Nombre:</span> {instructor.pendiente.id_usuario.name}</p>
                    <p><span>Email:</span> {instructor.pendiente.id_usuario.email}</p>
                    <p><span>Rol:</span> {instructor.pendiente.id_usuario.rol}</p>
                    <p><span>Estado:</span> {instructor.pendiente.id_usuario.estado}</p>
                    <button className='back' onClick={() => navigate("/admin/panel/instructores-pendientes")}>&lt; Volver</button>
                </div>
                {curriculum && <embed src={curriculum} type="application/pdf"/>}
            </div>
            }
        </div>
    </div>
  )
}

export default Solicitud