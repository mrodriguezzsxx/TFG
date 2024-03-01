import React, { useEffect } from 'react'
import useForm from '../../hooks/useForm'
import { useNavigate } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import '../../assets/css/admin/adminLogin/adminLogin.css';
import Swal from 'sweetalert2';

const Admin = () => {
    const {form, changed} = useForm({});

    let navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token") && localStorage.getItem("user")) {
            navigate("/admin/panel");
          }
    }, [navigate]);
    const login = async(e) => {
        e.preventDefault();

        let userToLogin = form;

        const request = await fetch(Global.urlAdmin + "login", {
            method: "POST",
            body: JSON.stringify(userToLogin),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await request.json();

        if(data.status === "success") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            Swal.fire({
                title: data.message,
                icon: data.status,
                timer: 2000
              });
            setTimeout(() => {
                navigate("/admin/panel");
            }, 2000);
        }else {
            Swal.fire({
                title: data.message,
                icon: data.status,
                timer: 2000
              });
        }
    }
  return (
    <div className='admin'>
        <form className='formAdmin' onSubmit={login}>
            <h1>Iniciar Sesión</h1>
            <div className='form-group'>
                <input type="email" name='email' placeholder='E-mail' onChange={changed} />
            </div>
            <div className='form-group'>
                <input type="password" name='password' placeholder='Contraseña' onChange={changed} />
            </div>
            <div className='form-group'>
                <input type="submit" value="LOGIN" />
            </div>
        </form>
    </div>
  )
}

export default Admin