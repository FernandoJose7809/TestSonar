import React from 'react';
// css
import './RegisterClient.css';
// icons
import { FaRegUserCircle } from "react-icons/fa";
// services
import { Apiurl } from '../services/apirest';
// librerías
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

class RegisterClient extends React.Component {
    state = {
        form: {
            nombre: "",
            apellido: "",
            fecha_nacimiento: "",
            telefono: ""
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
        let url = Apiurl + "clientes/"; // La URL de la API para el registro
        axios.post(url, this.state.form)
            .then(response => {
                if (response.data) { // Si la respuesta es exitosa
                    alert("Cliente registrado");
                    this.setState({
                        form: { // Limpiar el formulario
                            nombre: "",
                            apellido: "",
                            fecha_nacimiento: "",
                            telefono: ""
                        },
                    });
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
                            <input 
                                type="text" 
                                name="nombre" 
                                placeholder='Nombre' 
                                required 
                                value={this.state.form.nombre} // Vincular el valor del input
                                onChange={this.manejadorChange} 
                            />
                            <FaRegUserCircle className='icon' />
                        </div>
                        <div className="input-box">
                            <input 
                                type="text" 
                                name="apellido" 
                                placeholder='Apellido' 
                                required 
                                value={this.state.form.apellido} // Vincular el valor del input
                                onChange={this.manejadorChange} 
                            />
                            <FaRegUserCircle className='icon' />
                        </div>
                        <div className="input-box">
                            <input 
                                type="date" 
                                name="fecha_nacimiento" 
                                placeholder='Fecha de Nacimiento' 
                                required 
                                value={this.state.form.fecha_nacimiento} // Vincular el valor del input
                                onChange={this.manejadorChange} 
                            />
                        </div>
                        <div className="input-box">
                            <input 
                                type="tel" 
                                name="telefono" 
                                placeholder='Teléfono' 
                                required 
                                value={this.state.form.telefono} // Vincular el valor del input
                                onChange={this.manejadorChange} 
                            />
                        </div>
                        <button type="submit" onClick={this.manejadorBoton}>Registrar</button>
                    </form>
                    <br />
                    {this.state.error && <div className="alert alert-danger" role="alert">{this.state.errorMsg}</div>}
                </div>
            </React.Fragment>
        );
    }
}

function RegisterClientWrapper() {
    const navigate = useNavigate();
    return <RegisterClient navigate={navigate} />;
}

export default RegisterClientWrapper;
