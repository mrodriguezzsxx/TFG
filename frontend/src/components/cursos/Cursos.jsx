import Header from '../layout/Header';
import CartaCurso from './CartaCurso';
import '../../assets/css/cursos/cursos.css';
import { Global } from '../../helpers/Global';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Cursos = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [categoryValue, setCategoryValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(Global.urlCursos + 'mostrar-cursos', {
          method: 'GET',
        }); // Reemplaza con la URL de tu API
        const jsonData = await response.json();
        setData(jsonData);
        console.log(jsonData);
      } catch (error) {
        console.log('Error al obtener los datos de la API:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategoryValue(event.target.value);
  };

  const filteredCursos = data.cursos && data.cursos.filter((curso) => {
    const titleMatch = curso.title.toLowerCase().includes(searchValue.toLowerCase());
    const categoryMatch = categoryValue ? curso.category === categoryValue : true;

    return titleMatch && categoryMatch;
  });

  return (
    <div>
      <Header />
      <div className='mainCursos1'>
        <div className='buscador'>
          <select name='category' className='categorias' required defaultValue="" onChange={handleCategoryChange}>
            <option value="">Selecciona Categoría</option>
            <option value="Deportes">Deportes</option>
            <option value="Videojuegos">Videojuegos</option>
            <option value="Musica">Música</option>
            <option value="Comida">Comida</option>
            <option value="Programacion">Programación</option>
            <option value="Idiomas">Idiomas</option>
          </select>
          <input type='search' name='search' placeholder='Buscar...' onChange={handleSearchChange} />
        </div>
        {/* Renderiza los datos filtrados si existen */}
        {filteredCursos && filteredCursos.map((item) => (
          <div key={item._id}>
            <Link to={"/cursos/ver-curso/" + item._id}>
              <CartaCurso imgCurso={item.image} nameCurso={item.title} descripcionCurso={item.description} puntuacionEstrellas={item.ratingPromedio}/>
            </Link>
          </div>
        ))}
        {/* Si no hay cursos filtrados, muestra un mensaje */}
        {filteredCursos && filteredCursos.length === 0 && <p className='no-cursos'>No se encontraron cursos.</p>}
      </div>
    </div>
  )
}

export default Cursos;
