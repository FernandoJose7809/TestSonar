import React from 'react';
// css
import './UserList.css';
// services
import { Apiurl } from '../services/apirest';
// librerías
import axios from 'axios';

class UserList extends React.Component {

    state = {
        users: [],
        error: false,
        errorMsg: "",
        showModal: false,
        currentUser: {
            id: "",
            username: "",
            email: ""
        }
    }

    componentDidMount() {
        this.obtenerUsuarios();
    }

    obtenerUsuarios = () => {
        let url = Apiurl + "usuarios"; // URL de la API para obtener los usuarios
        axios.get(url)
            .then(response => {
                if (response.data) {
                    this.setState({ users: response.data });
                } else {
                    this.setState({ error: true, errorMsg: "Failed to fetch users" });
                }
            })
            .catch(error => {
                this.setState({ error: true, errorMsg: "Error fetching users" });
            });
    }

    eliminarUsuario = (id) => {
        let url = Apiurl + "usuarios/" + id; // URL para eliminar el usuario
        axios.delete(url)
            .then(response => {
                this.obtenerUsuarios(); // Recargar la lista de usuarios después de eliminar
            })
            .catch(error => {
                this.setState({ error: true, errorMsg: "Error deleting user" });
            });
    }

    editarUsuario = (user) => {
        this.setState({ currentUser: user, showModal: true });
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            currentUser: {
                ...prevState.currentUser,
                [name]: value
            }
        }));
    }

    handleEditSubmit = () => {
        const { currentUser } = this.state;
        let url = Apiurl + "usuarios/" + currentUser.id; // URL para editar el usuario
        axios.put(url, currentUser)
            .then(response => {
                this.setState({ showModal: false });
                this.obtenerUsuarios(); // Recargar la lista de usuarios después de editar
            })
            .catch(error => {
                this.setState({ error: true, errorMsg: "Error updating user" });
            });
    }

    closeModal = () => {
        this.setState({ showModal: false });
    }

    render() {
        const { users, showModal, currentUser } = this.state;

        return (
            <React.Fragment>
                <div className='wrapper'>
                    <h2>Usuarios</h2>
                    {this.state.error && <div className="alert alert-danger" role="alert">{this.state.errorMsg}</div>}

                    {/* Estructura de tabla para los usuarios */}
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button onClick={() => this.editarUsuario(user)} className="btn-edit">Editar</button>
                                        <button onClick={() => this.eliminarUsuario(user.id)} className="btn-delete">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Modal para editar usuario */}
                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <h3>Editar Usuario</h3>
                                <form onSubmit={(e) => { e.preventDefault(); this.handleEditSubmit(); }}>
                                    <div>
                                        <label>Usuario:</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={currentUser.username}
                                            onChange={this.handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Email:</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={currentUser.email}
                                            onChange={this.handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="modal-buttons">
                                        <button type="button" onClick={this.handleEditSubmit}>Editar</button>
                                        <button type="button" onClick={this.closeModal}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default UserList;
