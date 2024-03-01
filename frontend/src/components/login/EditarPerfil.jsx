import useAuth from "../../hooks/useAuth"
import "../../assets/css/editarUsuario/editarUsuario.css"
import defaults from "../../assets/img/defaults.png"
import Header from "../layout/Header"
import { Global } from "../../helpers/Global"
import useForm from '../../hooks/useForm';
import Swal from 'sweetalert2';
import { useState } from "react"
import { useNavigate } from "react-router-dom"


const EditarPerfil = () => {
    const { auth, setAuth } = useAuth();
    const { form, changed } = useForm({});
    const [file, setFile] = useState(null);

    const navigate = useNavigate();
    const actualizarPerfil = async (e) => {
        e.preventDefault();
        const userDatos = form;

        const token = localStorage.getItem("token");

        const request = await fetch(Global.url + "update", {
            method: 'PUT',
            body: JSON.stringify(userDatos),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            }
        });
        const datos = await request.json();

        const formData = new FormData();
        formData.append("file0", file);

        const requestImage = await fetch(Global.url + "upload", {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": token
            }
        });
        const datosImage = await requestImage.json();


        setAuth(datos);
        setAuth(datosImage);


        if (datos.status == "success") {
            Swal.fire({
                title: datos.message,
                icon: datos.status,
                timer: 2000
            });
            navigate("/cursos");
        } else {
            Swal.fire({
                title: datos.message,
                icon: datos.status,
                timer: 2000
            });
        }
    }

    const previsualizarImagen = () => {
        const inputFile = document.getElementById("file-1");
        const imagePreview = document.querySelector(".image-preview");

        inputFile.addEventListener("change", () => {
            const file = inputFile.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                imagePreview.src = reader.result;
            };

            reader.readAsDataURL(file);
        });
    }

    return (
        <div>
            <Header />
            <div className="editarPerfil">
                <form className="formPerfil" onSubmit={actualizarPerfil}>
                    <div className="divPerfil">
                        <div className="containerInputsPerfil">
                            <div className="inputFlex">
                                <label htmlFor="nombre">Nombre:</label>
                                <input type="text" name="name" defaultValue={auth.name} onChange={changed} />
                                <label htmlFor="correo">Correo:</label>
                                <input type="email" name="email" defaultValue={auth.email} onChange={changed} disabled   />
                                <label htmlFor="password">Contraseña:</label>
                                <input type="password" name="password" placeholder="Nueva Contraseña" onChange={changed} />
                                <label htmlFor="rol">Rol:</label>
                                <input type="text" disabled defaultValue={auth.rol} />
                            </div>
                        </div>
                        <div className="divImagePerfil">
                            <div className="containerImagePerfil">
                                <p>Foto de perfil:</p>
                                <div className="actImagen">
                                    {auth.image === "default.png" ?
                                        <img src={defaults} onChange={changed} className="image-preview gif" />
                                        : <img src={Global.url + "avatar/" + auth.image} onChange={changed} className="image-preview gif" />
                                    }
                                </div>
                                <div className="container-input">
                                    <input type="file" name="file0" id="file-1" onChange={(e) => setFile(e.target.files[0])} onClick={previsualizarImagen} className="inputfile inputfile-1" accept="image/png,image/jpeg,image/jpg" data-multiple-caption="{count} archivos seleccionados" multiple />
                                    <label htmlFor="file-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="iborrainputfile" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                                        <span className="iborrainputfile">IMPORTAR IMAGEN</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="botonGuardar">
                        <input type="submit" value='GUARDAR' />
                    </div>
                </form>
            </div >
        </div>
    )
}

export default EditarPerfil