import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Apiurl } from '../services/apirest';
import './Caja.css'; // Referencia al nuevo CSS
import logo from '../imagenes/logo1.jpeg';

const Caja = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [selectedDestinationAccount, setSelectedDestinationAccount] = useState(''); // Para la cuenta de destino
    const [selectedClient, setSelectedClient] = useState(''); // Estado para mostrar el cliente de la cuenta origen
    const [selectedDestinationClient, setSelectedDestinationClient] = useState(''); // Para el cliente de la cuenta destino
    const [amount, setAmount] = useState('');
    const [operation, setOperation] = useState('deposit'); // 'deposit', 'withdraw' o 'transfer'
    const [description, setDescription] = useState(''); // Para la descripción opcional
    const [details, setDetails] = useState(''); // Para detalles opcionales
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Nuevo estado para la caja, usuario y saldo
    const [caja, setCaja] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [saldoCaja, setSaldoCaja] = useState(0); // Saldo de la caja

    const navigate = useNavigate();

    useEffect(() => {
        fetchAccounts();
        fetchCaja(); // Obtener la caja al cargar el componente
        fetchUsuario(); // Obtener el usuario (cajero) al cargar el componente
    
        // Obtener el número de caja y saldo desde localStorage
        const numeroCaja = localStorage.getItem('numeroCaja');
        const saldoEntrada = localStorage.getItem('saldoEntrada');
    
        if (numeroCaja) {
            setCaja(numeroCaja); // Establecer el número de caja
        }
        if (saldoEntrada) {
            setSaldoCaja(parseFloat(saldoEntrada)); // Establecer el saldo de la caja
        }
    }, []);

    const fetchAccounts = () => {
        axios.get(`${Apiurl}cuentas-ahorro/`)
            .then(response => {
                setAccounts(response.data);
            })
            .catch(() => {
                setError('Error al obtener las cuentas de ahorro');
            });
    };

    // Función para obtener la caja desde la API
    const fetchCaja = () => {
        const numeroCaja = localStorage.getItem('numeroCaja');
        const saldoEntrada = localStorage.getItem('saldoEntrada');
    
        if (numeroCaja && saldoEntrada) {
            setCaja(numeroCaja);
            setSaldoCaja(parseFloat(saldoEntrada));
        } else {
            setError('No hay ninguna caja abierta');
        }
    };

    // Función para obtener el usuario (cajero) desde la API
    const fetchUsuario = () => {
        const userId = localStorage.getItem("userId"); // Obtener el ID del usuario de localStorage
        axios.get(`${Apiurl}usuarios/${userId}/`) // Cambia la URL para obtener el usuario por ID
            .then(response => {
                setUsuario(response.data); // Guardar los datos del cajero
            })
            .catch(() => {
                setError('Error al obtener el usuario');
            });
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleAccountChange = (e) => {
        const accountId = e.target.value;
        setSelectedAccount(accountId);

        const selectedAccountData = accounts.find(account => account.id === parseInt(accountId));
        if (selectedAccountData) {
            const client = selectedAccountData.cliente;
            setSelectedClient(`${client.nombre} ${client.apellido}`);
        } else {
            setSelectedClient('');
        }
    };

    const handleDestinationAccountChange = (e) => {
        const accountId = e.target.value;
        setSelectedDestinationAccount(accountId);

        const selectedAccountData = accounts.find(account => account.id === parseInt(accountId));
        if (selectedAccountData) {
            const client = selectedAccountData.cliente;
            setSelectedDestinationClient(`${client.nombre} ${client.apellido}`);
        } else {
            setSelectedDestinationClient('');
        }
    };

    const handleOperation = (e) => {
        setOperation(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedAccount || !amount || (operation === 'transfer' && !selectedDestinationAccount)) {
            setError('Debes seleccionar las cuentas y un monto');
            setSuccessMessage('');
            return;
        }

        const monto = parseFloat(amount);
        if (operation === 'withdraw' && monto > saldoCaja) {
            setError('El monto del retiro excede el saldo disponible en caja');
            setSuccessMessage('');
            return;
        }

        let apiUrl = '';
        let data = {};

        if (operation === 'deposit') {
            apiUrl = `${Apiurl}deposito/`;
            data = {
                cuenta: selectedAccount,
                monto: monto,
                descripcion: 'Depósito'
            };
            setSaldoCaja(saldoCaja + monto); // Aumentar el saldo de la caja
        } else if (operation === 'withdraw') {
            apiUrl = `${Apiurl}retiro/`;
            data = {
                cuenta: selectedAccount,
                monto: monto,
                descripcion: 'Retiro'
            };
            setSaldoCaja(saldoCaja - monto); // Reducir el saldo de la caja
        } else if (operation === 'transfer') {
            apiUrl = `${Apiurl}transferencia/`; // Cambia la URL según tu endpoint
            data = {
                monto: monto,
                cuenta_origen: selectedAccount,
                cuenta_destino: selectedDestinationAccount,
                descripcion: description || 'Transferencia',
                detalles: details || ''
            };
        }

        axios.post(apiUrl, data)
            .then(() => {
                setSuccessMessage('Operación realizada con éxito');
                setError('');
                setAmount('');
                setSelectedAccount('');
                setSelectedDestinationAccount('');
                setSelectedClient('');
                setSelectedDestinationClient('');
                setDescription('');
                setDetails('');
                fetchAccounts();
            })
            .catch(() => {
                setError('Error al realizar la operación');
                setSuccessMessage('');
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className={`caja-dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Sidebar */}
            <nav className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <img src={logo} alt="Logo" className="sidebar-logo" />
                </div>
                <ul>
                    <li><a href="#logout" onClick={handleLogout}><i className="bi bi-box-arrow-right"></i> <span>Cerrar caja</span></a></li>
                </ul>
            </nav>

            {/* Main content */}
            <div className="main-content-caja">

                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                <form className='form-caja' onSubmit={handleSubmit}>
                    <div>
                        <h2>Gestión de Caja</h2>
                        <label>Operación:</label>
                        <select value={operation} onChange={handleOperation}>
                            <option value="deposit">Depósito</option>
                            <option value="withdraw">Retiro</option>
                            <option value="transfer">Transferencia</option>
                        </select>
                    </div>

                    {/* Mostrar información de la caja, saldo y del usuario */}
                    {caja && usuario && (
                        <div>
                            <p><strong>Caja seleccionada:</strong> Caja #{caja}</p>
                            <p><strong>Cajero:</strong> {usuario.username}</p>
                            <p><strong>Saldo en Caja:</strong> {saldoCaja} Bs</p>
                        </div>
                    )}

                    <div>
                        <label className='label-caja'>Cuenta Origen:</label>
                        <select onChange={handleAccountChange} value={selectedAccount}>
                            <option value="">Selecciona una cuenta</option>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.numero} - Saldo: {account.saldo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        {selectedClient && <p><strong>Cliente: </strong>{selectedClient}</p>}
                    </div>

                    {operation === 'transfer' && (
                        <div>
                            <label className='label-caja'>Cuenta Destino:</label>
                            <select onChange={handleDestinationAccountChange} value={selectedDestinationAccount}>
                                <option value="">Selecciona una cuenta</option>
                                {accounts.map(account => (
                                    <option key={account.id} value={account.id}>
                                        {account.numero} - Saldo: {account.saldo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {selectedDestinationClient && (
                        <div>
                            <p><strong>Cliente Destino: </strong>{selectedDestinationClient}</p>
                        </div>
                    )}

                    <div>
                        <label>Monto:</label>
                        <input type="number" value={amount} onChange={handleAmountChange} />
                    </div>

                    {operation === 'transfer' && (
                        <>
                            <div>
                                <label>Descripción (opcional):</label>
                                <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div>
                                <label>Detalles (opcional):</label>
                                <input type="text" value={details} onChange={e => setDetails(e.target.value)} />
                            </div>
                        </>
                    )}

                    <button type="submit">Realizar operación</button>
                </form>
            </div>
        </div>
    );
}

export default Caja;
