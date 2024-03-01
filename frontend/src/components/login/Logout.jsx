import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Logout = () => {
    const {setAuth} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();

        setAuth({});

        navigate("/cursos");
    }, [navigate]);
  return (
    <div>Cerrando sesión</div>
  )
}

export default Logout