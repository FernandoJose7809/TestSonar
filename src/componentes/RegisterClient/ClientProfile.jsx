import React, { useEffect, useState } from 'react';
import './ClientProfile.css'; // CSS del componente
import axios from 'axios';
import { Apiurl } from '../services/apirest';
import { Modal, Button } from 'react-bootstrap'; // Si estás usando Bootstrap para el modal

const ClientProfile = ({ clientId, onBack }) => {
    const [client, setClient] = useState(null);
    const [savingAccounts, setSavingAccounts] = useState([]);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [fechaCierreActiva, setFechaCierreActiva] = useState(false);  
    const [errorFecha, setErrorFecha] = useState('');
    const [showModal, setShowModal] = useState(false);  // Estado para controlar la visibilidad del modal
    const [productosAhorro, setProductosAhorro] = useState([]);
    
    // Estado para crear una nueva cuenta
    const [newAccount, setNewAccount] = useState({
        numero: '',
        saldo: 0,
        fecha_cierre: '',
        producto_ahorro_id: ''
    });

    useEffect(() => {
        obtenerCliente();
        obtenerCuentasDeAhorro();
    }, [clientId]);

    useEffect(() => {
        const url = `${Apiurl}producto-ahorro/`;
        axios.get(url) // Cambia esta URL según tu API
            .then(response => {
                setProductosAhorro(response.data);  // Guardar los productos en el estado
            })
            .catch(error => {
                console.error('Error al obtener productos de ahorro:', error);
            });
    }, []);

    const obtenerCliente = () => {
        const url = `${Apiurl}clientes/${clientId}/`;
        axios.get(url)
            .then(response => {
                setClient(response.data);
            })
            .catch(error => {
                setError(true);
                setErrorMsg('Error al obtener el perfil del cliente');
            });
    };

    const obtenerCuentasDeAhorro = () => {
        const url = `${Apiurl}cuentas-ahorro/por-cliente/${clientId}`;
        axios.get(url)
            .then(response => {
                setSavingAccounts(response.data);
                setError(false);
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    setSavingAccounts([]); 
                    setError(false);  
                    setErrorMsg('El usuario no tiene ninguna cuenta de ahorro.');
                } else {
                    setError(true);
                    setErrorMsg('Error al obtener las cuentas de ahorro');
                }
            });
    };

    const handleCreateSavingAccount = (e) => {
        e.preventDefault(); 

        const newAccountData = {
            ...newAccount,
            cliente_id: clientId,
            fecha_cierre: newAccount.fecha_cierre === '' ? null : newAccount.fecha_cierre // Asignar null si está vacío
        };
        console.log(newAccount)

        if (!newAccount.producto_ahorro_id) {
            setError(true);
            setErrorMsg('Debe seleccionar un producto de ahorro');
            return; // Detener la ejecución si no hay producto seleccionado
        }
        

        const url = `${Apiurl}cuentas-ahorro/`; 
        axios.post(url, newAccountData)
            .then(response => {
                setSavingAccounts([...savingAccounts, response.data]); 
                setNewAccount({ numero: '', saldo: 0, fecha_cierre: '', producto_ahorro_id: ''}); 
                setShowModal(false); // Cerrar el modal después de crear la cuenta
            })
            .catch(error => {
                setError(true);
                setErrorMsg('Error al crear la cuenta de ahorro');
            });
    };

    const handleProductoAhorroChange = (e) => {
        setNewAccount({ ...newAccount, producto_ahorro_id: e.target.value });
        console.log(newAccount)
    };

    const handleFechaCierreChange = (e) => {
        const fechaSeleccionada = new Date(e.target.value);
        const fechaActual = new Date();

        if (fechaSeleccionada <= fechaActual) {
            setErrorFecha('La fecha de cierre debe ser mayor a la fecha actual');
        } else {
            setErrorFecha('');
            setNewAccount({ ...newAccount, fecha_cierre: e.target.value });
        }
    };

    const handleCheckboxChange = () => {
        setFechaCierreActiva(!fechaCierreActiva);

        if (!fechaCierreActiva) {
            setNewAccount({ ...newAccount, fecha_cierre: null });
            setErrorFecha('');  
        }
    };

    const handleBackClick = () => {
        if (onBack) {
            onBack(); 
        }
    };

    const handleModalShow = () => {
        setShowModal(true);  // Mostrar modal
    };

    const handleModalClose = () => {
        setShowModal(false);  // Cerrar modal
    };

    return (
        <div className='client-profile-container'>
            {error && <div className="alert alert-danger">{errorMsg}</div>}

            <button onClick={handleBackClick} className="btn-back">
                Volver a la Lista de Clientes
            </button>

            {client && (
                <div className='profile-details'>
                    <h2>Perfil del Cliente</h2>
                    <p><strong>Nombre:</strong> {client.nombre}</p>
                    <p><strong>Apellido:</strong> {client.apellido}</p>
                    <p><strong>Fecha de Nacimiento:</strong> {client.fecha_nacimiento}</p>
                    <p><strong>Teléfono:</strong> {client.telefono}</p>

                    <h3>Cuentas de Ahorro</h3>
                    {savingAccounts.length > 0 ? (
                        <ul>
                            {savingAccounts.map(account => (
                                <li key={account.id}>
                                    <strong>Número de Cuenta:</strong> {account.numero}<br />
                                    <strong>Saldo:</strong> {account.saldo}<br />
                                    <strong>Producto:</strong> {account.producto_ahorro.nombre}<br />
                                    <strong>Fecha de Apertura:</strong> {account.fecha_apertura}
                                    
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="no-accounts">
                            <p>No tiene cuentas de ahorro contratadas.</p>
                        </div>
                    )}

                    {/* Botón para abrir el modal */}
                    <button onClick={handleModalShow} className="btn-create-savings">
                        Crear Nueva Cuenta de Ahorro
                    </button>
                </div>
            )}

            <Modal show={showModal} onHide={handleModalClose} backdrop="static" className='modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Nueva Cuenta de Ahorro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleCreateSavingAccount}>
                        <div>
                            <label>Producto de Ahorro:</label>
                            <select
                                value={newAccount.producto_ahorro_id}
                                onChange={handleProductoAhorroChange}
                                required
                            >
                                <option value="" disabled>Seleccione un producto</option>
                                {productosAhorro.map(producto => (
                                    <option key={producto.id} value={producto.id}>
                                        {producto.nombre} - Tasa: {producto.tasa_interes}%
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Saldo inicial:</label>
                            <input
                                type="number"
                                value={newAccount.saldo}
                                onChange={(e) => setNewAccount({ ...newAccount, saldo: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={fechaCierreActiva}
                                    onChange={handleCheckboxChange}
                                />
                                ¿Desea establecer una fecha de expiración?
                            </label>
                        </div>

                        <div>
                            <label>Fecha de expiración:</label>
                            <input
                                type="date"
                                value={newAccount.fecha_cierre || ''}
                                onChange={handleFechaCierreChange}
                                disabled={!fechaCierreActiva}
                                required={fechaCierreActiva}
                            />
                            {errorFecha && <p style={{ color: 'red' }}>{errorFecha}</p>}
                        </div>
                        <button type="submit" className="btn-create-savings">
                            Crear Cuenta de Ahorro
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ClientProfile;
