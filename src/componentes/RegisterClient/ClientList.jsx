import React, { useState, useEffect } from 'react';
import './ClientList.css'; // Mantener el CSS actual
import { Apiurl } from '../services/apirest'; // URL de la API
import axios from 'axios';
import ClientProfile from './ClientProfile';
import { Link } from 'react-router-dom';


const ClientCRUD = () => {
    const [clients, setClients] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showSecondModal, setShowSecondModal] = useState(false);
    const [showProfile, setShowProfile] = useState(false); //

    // Cargar la lista de clientes al montar el componente
    useEffect(() => {
        obtenerClientes();
    }, []);

    const obtenerClientes = () => {
        const url = `${Apiurl}clientes/`; // URL de la API
        axios.get(url)
            .then(response => {
                if (response.data) {
                    setClients(response.data);
                } else {
                    setError(true);
                    setErrorMsg('Error al obtener la lista de clientes');
                }
            })
            .catch(error => {
                setError(true);
                setErrorMsg('Error de conexión con la API');
            });
    };

    const obtenerDocumentos = () => {
        const url = `${Apiurl}documentos-identidad/`; // URL de la API
        axios.get(url)
            .then(response => {
                if (response.data) {
                    setDocuments(response.data);
                } else {
                    setError(true);
                    setErrorMsg('Error al obtener la lista de documentos');
                }
            })
            .catch(error => {
                setError(true);
                setErrorMsg('Error de conexión con la API');
            });
    };

    const handleViewProfile = (client) => {
        setSelectedClient(client);
        setShowProfile(true); // Muestra el perfil
    };

    const handleBackToList = () => {
        setShowProfile(false); // Regresa a la lista de clientes
    };
    const eliminarCliente = (id) => {
        const url = `${Apiurl}clientes/${id}/`;
        axios.delete(url)
            .then(() => {
                setClients(clients.filter(client => client.id !== id)); // Eliminar cliente de la lista local
            })
            .catch(() => {
                setError(true);
                setErrorMsg('Error al eliminar cliente');
            });
    };

    const handleEdit = (client) => {
        setSelectedClient(client);
        setShowModal(true); // Mostrar el modal de edición
    };

    const handleNext = () => {
        setShowModal(false); // Cierra el primer modal
        setShowSecondModal(true); // Abre el segundo modal
    };

    const handleSecondModalInputChange = (e) =>{
        const { name, value } = e.target;
        setSelectedDocument(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSecondModalSave = () =>{

    }

    const handleCreate = () => {
        setSelectedClient({
            nombre: '',
            apellido: '',
            fecha_nacimiento: '',
            telefono: ''
        });
        setSelectedDocument({
            numero: '',
            expedido: '',
            emitido: '',
            expira: ''
        })
        setShowModal(true); // Mostrar modal para crear nuevo cliente
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedClient(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        const method = selectedClient.id ? 'PUT' : 'POST'; // PUT si tiene ID, POST si es nuevo
        const url = selectedClient.id ? `${Apiurl}clientes/${selectedClient.id}/` : `${Apiurl}clientes/`;

        axios({
            method: method,
            url: url,
            data: selectedClient
        })
            .then(response => {
                const savedClient = response.data;
                if (selectedClient.id) {
                    // Actualizar la lista de clientes si se está editando
                    setClients(clients.map(client => client.id === selectedClient.id ? response.data : client));
                } else {
                    // Añadir nuevo cliente a la lista
                    setClients([...clients, response.data]);
                }
                handleSaveDocument(savedClient.id);
                setSelectedClient(null);
                setShowModal(false); // Ocultar modal
            })
            .catch(() => {
                console.log("Error al guardar el cliente:", error.response.data);
                setError(true);
                setErrorMsg('Error al guardar el cliente');
                setShowModal(false);
                setShowSecondModal(false);
            });
    };

    const handleSaveDocument = (clientId) => {
        const documentData = {
            cliente_id: clientId, // Cambia 'cliente_id' a 'cliente' si es necesario
            numero: selectedDocument.numero,
            expedido: selectedDocument.expedido,
            emitido: selectedDocument.emitido,
            expira: selectedDocument.expira,
            fecha_nacimiento: selectedClient.fecha_nacimiento // Usar la fecha del cliente
        };
    
        axios.post(`${Apiurl}documentos-identidad/`, documentData)
            .then(response => {
                setShowSecondModal(false);
            })
            .catch((error) => {
                setError(true);
                setErrorMsg('Error al guardar el documento de identidad');
                setShowSecondModal(false);
            });
    };

    return (
        <div className='uses-container'>
            <h2>Clientes</h2>
            {error && <div className="alert alert-danger" role="alert">{errorMsg}</div>}

            
            {!showProfile ? ( // Verifica si se está mostrando el perfil
                <>
            <button onClick={handleCreate} className="btn-create">Crear Cliente</button>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
                        <tr key={client.id}>
                            <td>
                                <span onClick={() => handleViewProfile(client)} className="client-name">
                                    {client.nombre}
                                </span>
                            </td>
                            <td>{client.apellido}</td>
                            <td>{client.fecha_nacimiento}</td>
                            <td>{client.telefono}</td>
                            <td>
                                <button onClick={() => handleEdit(client)} className="edit-btn">Editar</button>
                                <button onClick={() => eliminarCliente(client.id)} className="delete-btn">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{selectedClient.id ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <div>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={selectedClient.nombre}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Apellido:</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={selectedClient.apellido}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Fecha de Nacimiento:</label>
                                <input
                                    type="date"
                                    name="fecha_nacimiento"
                                    value={selectedClient.fecha_nacimiento}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Teléfono:</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={selectedClient.telefono}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="modal-buttons">
                                
                                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="button" onClick={handleNext}>Siguiente</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showSecondModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Documento de identidad</h3>
                            <form onSubmit={(e) => { e.preventDefault(); handleSecondModalSave(); }}>
                                {/* Agrega tus campos adicionales aquí */}
                                <div>
                                    <label>Numero de carnet:</label>
                                    <input
                                        type="text"
                                        name="numero"
                                        value={selectedDocument.numero}
                                        onChange={handleSecondModalInputChange}
                                        required
                                    />
                                    <label>Expedido:</label>
                                    <input
                                        type="text"
                                        name="expedido"
                                        value={selectedDocument.expedido}
                                        onChange={handleSecondModalInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Emitido:</label>
                                    <input
                                        type="date"
                                        name="emitido"
                                        value={selectedDocument.emitido}
                                        onChange={handleSecondModalInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Expira:</label>
                                    <input
                                        type="date"
                                        name="expira"
                                        value={selectedDocument.expira}
                                        onChange={handleSecondModalInputChange}
                                        required
                                    />
                                </div>
                                <div className="modal-buttons">
                                    <button type="button" onClick={handleSave}>Guardar</button>
                                    <button type="button" onClick={() => {
                                        setShowSecondModal(false);
                                        setShowModal(true); // Mostrar el primer modal
                                    }}>
                                        Atrás
                                    </button>
                                    <button type="button" onClick={() => setShowSecondModal(false)}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </>
            ) : (
                <ClientProfile clientId={selectedClient.id} onBack={handleBackToList} /> // Muestra el perfil del cliente
            )}
        </div>
    );
};

export default ClientCRUD;
