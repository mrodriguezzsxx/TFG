import React, { useRef } from 'react'
import "../../assets/css/login/login.css"
import { Global } from '../../helpers/Global';
import useForm from '../../hooks/useForm'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const Login = () => {
  const {form, changed} = useForm({});

  let navigate = useNavigate();

  const login = async(e) => {
    e.preventDefault()
    const userForm = form
    const request = await fetch(Global.url+ "login",{
      method:"POST",
      body:JSON.stringify(userForm),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const datos = await request.json();

    if(datos.status === "success") {
      localStorage.setItem("token",datos.token)
      localStorage.setItem("user",JSON.stringify(datos.user))
      Swal.fire({
        title: datos.message,
        icon: datos.status,
        timer: 2000
      });
      setTimeout(() => {
        navigate("../cursos");
      }, 2000);
    }else {
      Swal.fire({
        title: datos.message,
        icon: datos.status,
        timer: 2000
      });
    }
    

  }
  return (
    <div className='background'>
        <div className='main'>
          <div className='cabecera'>
            <h4 className='titulo'>Iniciar Sesión</h4>
            <div className='rayaSignIn'></div> 
          </div>
          <form onSubmit={login} >
            <input type='email' placeholder='Email' name='email' onChange={changed}/>
            <input type='password' placeholder='Contraseña' name='password' onChange={changed}/>
            <a href="">Olvide mi contraseña</a>
            <input type="submit" value="Iniciar Sesión" className='botonIni'/>
            <p>No tienes cuenta? <Link to="../registro" >Registrate</Link></p>
            <div className='recuerdame'>
              <input type="checkbox" className="cocoCheck" name="coco" />
              <label htmlFor="cocoCheck">Recuerdme</label>
            </div>
          </form> 
        </div>
        <div className=''>
        </div>
    </div>
  )
}

export default Login