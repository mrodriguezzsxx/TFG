import "../../assets/css/cursos/cartaCursos.css"
import { Global } from "../../helpers/Global"
import Rating from "./Rating"

const CartaCurso = (props) => {

    return (
        <div className="carta">
            <div className="carta2">
                <div>
                <img className="imagen_curso" src={Global.urlCursos + "visualizar-imagen/" + props.imgCurso } alt="imagen del curso"/>
                </div>
                <div className="puntuacion">
                    <h2 className="nombreCurso">{props.nameCurso}</h2>
                    <div className="estrellas rating">
                    <Rating estrellas={props.puntuacionEstrellas} className="estrellas"/>
                    </div>
                </div>
            </div>
            <div>
            <p className="descripcionCurso">{props.descripcionCurso}</p>
            
            </div>
        </div>
    )

}
export default CartaCurso