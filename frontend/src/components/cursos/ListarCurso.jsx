import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

import '../../assets/css/cursos/listarCurso.css';
import useAuth from '../../hooks/useAuth';
import Header from '../layout/Header';
import { NavLink } from 'react-router-dom';
import defaults from '../../assets/img/defaults.png';
import { Global } from '../../helpers/Global';
import Swal from 'sweetalert2';

const ListarCurso = () => {

    const [initialComments, setInitialComments] = useState(3);
    const [increment, setIncrement] = useState(2);
    const [popUp, setPopUp] = useState(false);
    const [cursos, setCursos] = useState([]);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [showLoginAlert, setShowLoginAlert] = useState(null);
    const [mostrarRating, setMostrarRating] = useState(0);
    const [ratingSaved, setRatingSaved] = useState(false); // Nuevo estado para controlar si el rating se ha guardado
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [guardarRating, setGuardarRating] = useState(0);

    const idCurso = window.location.pathname.split('/')[3];

    const starArray = [...Array(5).keys()].map(i => i + 1);
    const { auth } = useAuth();

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        obtenerCurso();
    }, []);

    useEffect(() => {
        obtenerComentarios();
    }, [initialComments]);

    useEffect(() => {
        obtenerRating();
      }, [cursos, auth._id, selectedRating]);
    
      useEffect(() => {
        console.log(guardarRating);
        localStorage.setItem('selectedRating', selectedRating.toString());
        setGuardarRating(selectedRating);
          agregarRating();
        
      }, [selectedRating, ratingSaved, auth._id, cursos]);
    
      useEffect(() => {
        if (!ratingSaved) {
            setHoverRating(selectedRating);
          }
      }, [selectedRating]);

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight) {
            setTimeout(() => {
                setInitialComments(prevComments => prevComments + increment);
            }, 500);
        }
    };

    const obtenerComentarios = async() => {
        const request = await fetch(Global.urlCursos + "comentarios/" + idCurso, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const datos = await request.json();

        
        const commentsToShow = datos.comentarios.slice(0, initialComments);
        setComentarios(commentsToShow);
    }


    const cerrarModal = () => {
        setPopUp(false);
        document.getElementById("negro").classList.remove("negro");
        document.body.classList.remove("modal-open");

    }

    const abrirModal = () => {
        setPopUp(true);
        document.getElementById("negro").classList.add("negro");
        document.body.classList.add("modal-open");

    }

    const realizarPago = (e) => {
        e.preventDefault();
    }

    const obtenerCurso = async () => {
        const requestMostrar = await fetch(Global.urlCursos + "mostrar-curso/" + idCurso, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })

        const cursos = await requestMostrar.json();
        setCursos(cursos);

    }

    const descargarReceta = async() => {
        try {
          const url = Global.urlCursos + "visualizar-docs/" + cursos.curso.pdf;
          const response = await fetch(url);
          const blob = await response.blob();
          
          const enlaceDescarga = document.createElement('a');
          enlaceDescarga.href = URL.createObjectURL(blob);
          enlaceDescarga.download = "curso.pdf";
          enlaceDescarga.click();
        } catch (error) {
          console.error('Error al descargar el archivo:', error);
        }
      }

      const agregarComentario = async() => {
        if(nuevoComentario.trim().length <= 10) {
            Swal.fire({
                icon: 'error',
                title: 'Necesitas un minimo de 10 caracteres',
                timer: 1500
              })
              return;
        }
        const request = await fetch(Global.urlCursos + "comentario/"+ idCurso, {
            method: "POST",
            body: JSON.stringify({ texto: nuevoComentario}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
              }
        })

        if (request.ok) {
            // Limpiar el campo de texto y actualizar los comentarios
            setNuevoComentario("");
            obtenerComentarios();
          }
      }

      const eliminarComentario = async (comentarioId) => {
        const request = await fetch(Global.urlCursos + idCurso + "/comentario/" + comentarioId, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
          }
        });
    
        if (request.ok) {
          // Actualizar los comentarios después de eliminar
          obtenerComentarios();
        }
      };
    
      const showLoginMessage = () => {
          setShowLoginAlert(true);
      }

      const hideAlert = () => {
          setShowLoginAlert(false);
          setShowInstructorAlert(false);
      }


      const agregarRating = async () => {
        if (auth._id && selectedRating !== 0) {
          const request = await fetch(Global.urlCursos + 'rating/' + idCurso, {
            method: 'POST',
            body: JSON.stringify({
              rating: parseInt(selectedRating),
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem('token'),
            },
          });
      
          if (request.ok) {
            const datos = await request.json();
            setGuardarRating(datos.rating);
            setMostrarRating(datos.rating);
            setRatingSaved(true);
          }
        }
      };
      
      

      const obtenerRating = async () => {
        if (!idCurso) {
          return;
        }
      
        if (auth._id) {
          const request = await fetch(Global.urlCursos + 'rating/' + idCurso, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem('token'),
            },
          });
      
          const datos = await request.json();
      
          if (datos.rating !== null && datos.rating !== undefined) {
            setMostrarRating(datos.rating);
            setHoverRating(datos.rating);
            setSelectedRating(datos.rating);
          } else {
            setMostrarRating(0);
            setHoverRating(0);
            setSelectedRating(0);
          }
      
          console.log(datos);
        }
      };


      const handleClick = (value) => {
        setSelectedRating(value);
        setHoverRating(value);
        setRatingSaved(false);
      };
    
      const handleHover = (value) => {
        setHoverRating(value);
      };
    
      const handleMouseLeave = () => {
        setHoverRating(selectedRating);
      };
      

      const renderStars = () => {
        const stars = [];
      
        if (auth._id) {
          for (let i = 1; i <= 5; i++) {
            const starIcon = i <= hoverRating ? solidStar : regularStar;
            stars.push(
              <FontAwesomeIcon
                key={i}
                icon={starIcon}
                onClick={() => handleClick(i)}
                onMouseEnter={() => handleHover(i)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: 'pointer' }}
                className={i <= selectedRating ? 'selected' : ''}
              />
            );
          }
        } else {
          // User is not logged in, show disabled stars
          for (let i = 1; i <= 5; i++) {
            stars.push(
              <FontAwesomeIcon
                key={i}
                icon={regularStar}
                style={{ cursor: 'not-allowed' }}
                className="disabled"
              />
            );
          }
        }
      
        return stars;
      };
    
    return (
        <div className='listar-curso'>
            <Header />
            <div id="negro">
                {cursos && cursos.curso && (
                    <div className='oscuro'>
                        <div className='imagen' style={{ backgroundImage: "url(" + Global.urlCursos + "visualizar-imagen/" + cursos.curso.image + ")", backgroundSize: "cover", backgroundPosition: "center" }} >
                            <div className='imagen-curso'> 
                                <p>{cursos.curso.title}</p> 
                                <div className='estrellas'>
                                <fieldset className="rating" onClick={agregarRating} onMouseLeave={handleMouseLeave}>
                                    {renderStars()}
                                </fieldset>
                                </div>
                            </div>
                        </div>
                        <div className='contenedor-curso'>
                            <div className='imagen-instructor'>
                                <div className='author-category'>
                                    <h3>Author:</h3>
                                    <p className='category'>{cursos.curso.category}</p>
                                </div>
                                <div className='info-i'>
                                    <img src={Global.url + "avatar/" + cursos.curso.idInstructor.image} />
                                    <p>{cursos.curso.idInstructor.email}</p>
                                </div>

                            </div>
                            <div className='descripcion'>
                                <h2>Descripcion:</h2>
                                <p>{cursos.curso.description}
                                </p>
                            </div>
                            {!auth._id ?
                                <NavLink to="/login" >
                                    <p><span>Precio:</span> {cursos.curso.price}$</p>
                                    <button className='incribirse'>Incribirse</button>
                                </NavLink>
                                :
                                <div className='price'>
                                <p><span>Precio:</span> {cursos.curso.price}$</p>
                                <button className='incribirse' onClick={abrirModal}>Incribirse</button>
                                </div>
                            }

                            <div className='video-curso'>
                                {auth._id && (
                                    <video controls preload='auto'>
                                    <source src={Global.urlCursos + "visualizar-video/"+cursos.curso.video} type='video/mp4' />
                                    </video>
                                )}
                                {!auth._id && (
                                    <video controls={false} className='pixelated-video'>
                                    <source src={Global.urlCursos + "visualizar-video/"+cursos.curso.video} type='video/mp4' />
                                    </video>
                                )}
                                {(!auth._id) ?
                                    <div>
                                        <button onMouseEnter={showLoginMessage} onMouseOut={hideAlert} className='bloqueado'>Descargar Curso</button>
                                        {showLoginAlert ? <p className='show-message'>{auth._id ? "Necesitas ser instructor" : "Necesitas iniciar Sesion"}</p> : ""}
                                    </div>
                                : 
                                    <button onClick={descargarReceta} onMouseEnter={showLoginMessage} onMouseOut={hideAlert} className='bloqueado'>Descargar Curso</button>
                                } 
                            
                            </div>
                            <div className='listar-comentarios'>
                                <h2>Comentarios</h2>

                                <div className='publicarComentario'>
                                    <textarea 
                                    className='comentar' 
                                    maxLength="370"
                                    placeholder='Publicar comentario' 
                                    value={nuevoComentario}
                                    onChange={(e) => setNuevoComentario(e.target.value)}
                                    disabled={!auth._id}></textarea>
                                    {auth._id ? (
                                        <button className='publicar' onClick={agregarComentario}>Publicar</button>
                                    ): (
                                        <button className='publicar2' disabled={!auth._id}>Publicar</button> 
                                    )}
                                </div>

                                {comentarios && comentarios.map((comment, index) => (
                                    <div className='ver-comentario' key={index}>
                                        <div>
                                            {auth.image == "default.png" ?
                                                <img src={defaults} alt="Foto de Perfil por defecto" />
                                            : 
                                            <img src={Global.url + "avatar/" + comment.user.image} alt='Foto de Perfil del usuario'/>
                                            }
                                            <div className='comentarios'>
                                                <h3>{comment.user.name}</h3>
                                                <p>{comment.texto}</p>
                                            </div>
                                        </div>
                                        {auth.rol === "instructor" && auth._id === cursos.curso.idInstructor._id ?
                                            <button onClick={() => eliminarComentario(comment._id)}>X</button>
                                        : ""}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {popUp && (
                <div className='modal-inscribirse'>
                    <form className='form-inscribirse' onSubmit={realizarPago}>
                        <div className='close' onClick={cerrarModal}>X</div>
                        <h2>Pago</h2>
                        <div className='form-group'>
                            <label htmlhtmlForm='titular'>Nombre Titular: *</label>
                            <input type='text' name='name' placeholder='Nombre Titular' />
                        </div>
                        <div className='form-group'>
                            <label htmlhtmlForm='targeta'>Numero Targeta: *</label>
                            <input type='text' name='numTargeta' placeholder='Numero Targeta' />
                        </div>
                        <div className='form-group'>
                            <label htmlhtmlForm='fechaCaducidad'>Fecha Caducidad: *</label>
                            <input type='text' name='fechaCaducidad' placeholder='fecha caducidad' />
                        </div>
                        <div className='form-group'>
                            <label htmlhtmlForm='cvv'>CVV: *</label>
                            <input type='number' name='cvv' placeholder='CVV' min="1" max="3" />
                        </div>
                        <input type='submit' value="Envia" />
                    </form>
                </div>

            )}
        </div>
    )
}

export default ListarCurso