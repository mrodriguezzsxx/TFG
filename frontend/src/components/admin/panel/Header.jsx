import React, { useEffect, useState } from 'react'
import defaults from '../../../assets/img/defaults.png';
import '../../../assets/css/admin/navBar/navBar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { Global } from '../../../helpers/Global';

const Header = () => {
    const [popUp, setPopUp] = useState(false);
    const [auth, setAuth] = useState({});

    const showPopUp = () => {
        setPopUp(true);
        if(popUp) {
            setPopUp(false);
        }
    }

    useEffect(() => {
        adminProfile()
    }, []);

    let navigate = useNavigate();
    useEffect(() => {
        if(!(localStorage.getItem("token") && localStorage.getItem("user"))) {
          navigate("/admin");
        }
      }, [navigate]);

    const adminProfile = async() => {

        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
    
        if(!token && !user) {
          return false;
        }
    
        const userObj = JSON.parse(user);
        const userId = userObj.id;
        const request = await fetch(Global.url + "profile/" + userId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          }
        })
    
        const datos =  await request.json();

        setAuth(datos.user);
      }

  return (
    <div className='navegacionAdmin'>
        <div className='panelAdmin'>
            <div className='adminCabecera'>
            <p>Panel <span>Administrativo</span></p>
            </div>
            <div className='perfilAdmin' onClick={showPopUp}>
                {auth._id ? (
                <div>
                    <li className='lista'>
                    {auth.image == "default.png" ?
                        <img src={defaults} alt="Foto de Perfil por defecto" />
                    : 
                    <img src={Global.url + "avatar/" + auth.image} alt='Foto de Perfil del usuario'/>
                    }
                    </li>
                </div>
            ): ""}
            </div>
        </div>

        <nav className='nav'>
            <ul>
                <li><NavLink to="../panel">Usuarios</NavLink></li>
                <li><NavLink to="../panel/gestion-cursos">Gestion Cursos</NavLink></li>
                <li><NavLink to="../panel/instructores-pendientes">Instructores Pendientes</NavLink></li>
            </ul>
        </nav>

        {popUp && (
                <div className='modal-user'>
                    <div className='perfil'>
                        <li className='lista'>
                        {auth.image == "default.png" ?
                            <img src={defaults} alt="Foto de Perfil por defecto" />
                        : 
                        <img src={Global.url + "avatar/" + auth.image} alt='Foto de Perfil del usuario'/>
                        }
                        </li>
                        <p className='name'>{auth.name}</p>
                    </div>
                    <div className='logout'>
                        <NavLink to="/admin/panel/logout" >
                            <button>Cerrar Sesión</button>
                        </NavLink>
                    </div>
                </div>
            )
            
            }
    </div>
  )
}

export default Header