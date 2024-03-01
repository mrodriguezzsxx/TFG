import React from 'react'
import llorando from './assets/img/llorando.png';
import './assets/css/error.css';
import { NavLink } from 'react-router-dom';

const Error = () => {
    return (
        <div className='error'>
            <div className='error-404'>
                <NavLink to="cursos">&lt; Cursos</NavLink>
                <h1>404</h1>
                <p>Pagina no encontrada</p>
            </div>
            <img src={llorando} alt="personaje llorando cuando no puedes acceder a la pagina" />
        </div>
    )
}

export default Error