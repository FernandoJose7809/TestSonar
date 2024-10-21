import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Apiurl } from '../services/apirest';
import './Caja.css'; // Referencia al nuevo CSS

const AbrirCaja = () => {
    const [cajas, setCajas] = useState([]); // Estado para la lista de cajas
    const [selectedCaja, setSelectedCaja] = useState(''); // Caja seleccionada
    const [saldoEntrada, setSaldoEntrada] = useState(''); // Saldo de entrada
    const [usuario, setUsuario] = useState(null); // Usuario (cajero)
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Obtener lista de cajas
    useEffect(() => {
        fetchCajas();
        fetchUsuario(); // Obtener el usuario al cargar el componente
    }, []);

    const fetchCajas = () => {
        axios.get(`${Apiurl}caja/`)
            .then(response => {
                setCajas(response.data);
            })
            .catch(() => {
                setError('Error al obtener las cajas');
            });
    };

    // Obtener usuario (cajero)
    const fetchUsuario = () => {
        axios.get(`${Apiurl}usuarios/`)
            .then(response => {
                const cajero = response.data.find(user => user.groups.includes('Cajero'));
                setUsuario(cajero);
            })
            .catch(() => {
                setError('Error al obtener el usuario');
            });
    };

    // Manejar el cambio de caja seleccionada
    const handleCajaChange = (e) => {
        setSelectedCaja(e.target.value);
    };

    // Manejar el cambio del saldo de entrada
    const handleSaldoChange = (e) => {
        setSaldoEntrada(e.target.value);
    };

    // Enviar la solicitud para abrir la caja
    // Enviar la solicitud para abrir la caja
const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCaja || !saldoEntrada || !usuario) {
        setError('Debe seleccionar una caja, ingresar el saldo de entrada y el usuario debe estar autenticado.');
        setSuccessMessage('');
        return;
    }

    const data = {
        usuario: usuario.id, // Usar el ID del cajero autenticado
        caja: parseInt(selectedCaja), // Convertir la caja a número
        saldo_entrada: parseFloat(saldoEntrada) // Convertir el saldo a número
    };

    axios.post(`${Apiurl}abrir-caja/`, data)
        .then(() => {
            // Guardar el número de caja y saldo en localStorage
            localStorage.setItem('numeroCaja', selectedCaja);
            localStorage.setItem('saldoEntrada', saldoEntrada);

            setSuccessMessage('Caja abierta exitosamente');
            setError('');
            // Redirigir a Caja.jsx
            navigate('/caja');
        })
        .catch(() => {
            setError('Error al abrir la caja');
            setSuccessMessage('');
        });
};


    return (
        <div className="abrir-caja-container">
            <h2>Abrir Caja</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Caja:</label>
                    <select value={selectedCaja} onChange={handleCajaChange}>
                        <option value="">Selecciona una caja</option>
                        {cajas.map(caja => (
                            <option key={caja.id} value={caja.id}>
                                Caja #{caja.numero}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Saldo de entrada:</label>
                    <input
                        type="number"
                        value={saldoEntrada}
                        onChange={handleSaldoChange}
                        placeholder="Ingresa el saldo de entrada"
                    />
                </div>

                <button type="submit">Abrir Caja</button>
            </form>
        </div>
    );
};

export default AbrirCaja;
