import React from 'react';
// css
import './RegisterUser.css';
// icons
import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
// services
import { Apiurl } from '../services/apirest';
// librerías
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

class RegisterUser extends React.Component {

    state = {
        form: {
            "username": "",
            "email": "",
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
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    }

    manejadorChange = async e => {
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }

    manejadorBoton = () => {
        let url = Apiurl + "usuarios"; // La URL de la API para el registro
        axios.post(url, this.state.form)
            .then(response => {
                if (response.data.token) { // Si la respuesta incluye un token
                    localStorage.setItem("token", response.data.token); // Guarda el token en localStorage
                    this.navigate("/Dashboard"); // Redirige al dashboard
                } else {
                    this.setState({ error: true, errorMsg: "Registration failed" });
                }
            })
            .catch(error => {
                this.setState({ error: true, errorMsg: "Error with registration" });
            });
    }

    render() {
        return (
            <React.Fragment>
                <div className='wrapper'>
                    <form onSubmit={this.manejadorSubmit}>
                        <div className="input-box">
                            <input type="text" name="username" placeholder='Username' required onChange={this.manejadorChange} />
                            <FaRegUserCircle className='icon' />
                        </div>
                        <div className="input-box">
                            <input type="email" name="email" placeholder='Email' required onChange={this.manejadorChange} />
                            <MdEmail className='icon' />
                        </div>
                        <div className="input-box">
                            <input type="password" name="password" placeholder='Password' required onChange={this.manejadorChange} />
                            <RiLockPasswordLine className='icon' />
                        </div>
                        <button type="submit" onClick={this.manejadorBoton}>Register</button>
                    </form>
                    <br />
                    {this.state.error && <div className="alert alert-danger" role="alert">{this.state.errorMsg}</div>}
                </div>
            </React.Fragment>
        );
    }
}

function RegisterUserWrapper() {
    const navigate = useNavigate();
    return <RegisterUser navigate={navigate} />;
}

export default RegisterUserWrapper;
