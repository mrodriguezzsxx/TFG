import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Cursos from '../components/cursos/Cursos';
import Login from '../components/login/Login';
import Registro from '../components/login/Registro';
import MisCursos from '../components/cursos/MisCursos';
import CrearCursos from '../components/cursos/CrearCursos';
import Error from '../Error';
import Logout from '../components/login/Logout';
import Admin from '../components/admin/Admin';
import Usuarios from '../components/admin/panel/Usuarios';
import EditarPerfil from '../components/login/EditarPerfil';
import GestionCursos from '../components/admin/panel/GestionCursos';
import Pendientes from '../components/admin/panel/Pendientes';
import LogoutAdmin from '../components/admin/panel/LogoutAdmin';
import Solicitud from '../components/admin/panel/Solicitud';
import ListarCurso from '../components/cursos/listarCurso';

const Routers = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route index element={<Cursos />} />
          <Route path="/cursos">
            <Route path='' element={<Cursos />} />
            <Route path="mis-cursos" element={<MisCursos />} />
            <Route path="crear-cursos" element={<CrearCursos />} />
            <Route path="editarPerfil" element={<EditarPerfil />} />
            <Route path="ver-curso/:id" element={<ListarCurso />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="logout" element={<Logout />} />

          <Route path="/admin">
            <Route path='' element={<Admin />}/>
            <Route path="panel" element={<Usuarios />} />
            <Route path="panel/gestion-cursos" element={<GestionCursos />} />
            <Route path="panel/instructores-pendientes" element={<Pendientes />} />         
            <Route path="panel/logout" element={<LogoutAdmin />} />
            <Route path="panel/instructores-pendientes/curriculum/:id" element={<Solicitud />} />
          </Route>
          
          <Route path="*" element={<Error />} />

      </Routes>
    
    </BrowserRouter>
    </>
  )
}

export default Routers;