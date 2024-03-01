import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LogoutAdmin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();

        navigate("/admin");
    }, [navigate]);
  return (
    <div>Cerrando sesión</div>
  )
}

export default LogoutAdmin