import React from 'react';
// css
import './Login.css';
// icons
import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { BsBank } from "react-icons/bs";
// services
import { Apiurl } from '../services/apirest';
// librerías
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

class Login extends React.Component {

    state = {
        form: {
            "username": "",
            "password": ""
        },
        error: false,
        errorMsg: ""
    }

    // Hook para redireccionar
    navigate = null;

    componentDidMount() {
        this.navigate = this.props.navigate; // Inicializa navigate desde props
    }

    manejadorSubmit = e => {
        e.preventDefault();
    }

    manejadorChange = async e => {
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }

    // Función que valida el grupo del usuario después del login
    validarRolUsuario = (username) => {
        let url = Apiurl + "usuarios/";
        axios.get(url)
            .then(response => {
                // Encuentra el usuario autenticado basado en el username
                const usuarioAutenticado = response.data.find(user => user.username === username);
                
                if (usuarioAutenticado) {
                    localStorage.setItem("userId", usuarioAutenticado.id); // Almacenar el ID del usuario
                    const grupos = usuarioAutenticado.groups;
                    
                    if (grupos.includes("Administrador")) {
                        this.navigate("/dashboard"); // Redirige al Dashboard si es Administrador
                    } else if (grupos.includes("Cajero")) {
                        this.navigate("/abrircaja"); // Redirige a Caja si es Cajero
                    } else {
                        this.setState({ error: true, errorMsg: "Usuario sin permisos suficientes" });
                    }
                } else {
                    this.setState({ error: true, errorMsg: "Usuario no encontrado" });
                }
            })
            .catch(() => {
                this.setState({ error: true, errorMsg: "Error al verificar el rol del usuario" });
            });
    }
    

    manejadorBoton = () => {
        let url = Apiurl + "login";
        axios.post(url, this.state.form)
            .then(response => {
                if (response.data.token) { // Si el token es válido
                    localStorage.setItem("token", response.data.token); // Guarda el token en localStorage
                    // Llama a la función para validar el rol del usuario
                    this.validarRolUsuario(this.state.form.username);
                } else {
                    this.setState({ error: true, errorMsg: "Authentication failed" });
                }
            })
            .catch(() => {
                this.setState({ error: true, errorMsg: "Error con el login" });
            });
    }

    render() {
        return (
            <React.Fragment>
                <div className='wrapper'>
                    <form onSubmit={this.manejadorSubmit}>
                        <BsBank className='logo' />
                        <div className="input-box">
                            <input type="text" name="username" placeholder='User' required onChange={this.manejadorChange} />
                            <FaRegUserCircle className='icon' />
                        </div>
                        <div className="input-box">
                            <input type="password" name="password" placeholder='Password' required onChange={this.manejadorChange} />
                            <RiLockPasswordLine className='icon' />
                        </div>
                        <button type="submit" onClick={this.manejadorBoton}>Login</button>
                    </form>
                    <br />
                    {this.state.error && <div className="alert alert-danger" role="alert">{this.state.errorMsg}</div>}
                </div>
            </React.Fragment>
        );
    }
}

function LoginWrapper() {
    const navigate = useNavigate();
    return <Login navigate={navigate} />;
}

export default LoginWrapper;
