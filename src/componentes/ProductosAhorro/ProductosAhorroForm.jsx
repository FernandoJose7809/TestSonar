import React, { useState, useEffect } from 'react';
import { Apiurl } from '../services/apirest';
import './ProductosAhorroForm.css';

const ProductosAhorroForm = ({ producto, onSave, onClose }) => {
  const [productoData, setProductoData] = useState(producto);
  const [politicasRequisitos, setPoliticasRequisitos] = useState({});
  const [politicasInteres, setPoliticasInteres] = useState({});
  const [step, setStep] = useState(1); 
  const [monedas, setMoneda] = useState([]);
  

  useEffect(() => {
    fetch(`${Apiurl}moneda/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => setMoneda(data))
      .catch(error => console.error('Error fetching productos:', error));
  }, []);
  console.log(monedas)
  const getMonedas = () => {

  }

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSave = () => {
    onSave(productoData, politicasRequisitos, politicasInteres);
    console.log(productoData)
  };

  return (
    <div className="modal">
      <div className="modal-content">
        {step === 1 && (
          <>
            <h2>{productoData.id ? 'Editar Producto de Ahorro' : 'Nuevo Producto de Ahorro'}</h2>

            <label>Nombre</label>
            <input
              type="text"
              value={productoData.nombre}
              onChange={(e) => setProductoData({ ...productoData, nombre: e.target.value })}
            />

            <label>Clave</label>
            <input
              type="text"
              value={productoData.clave}
              onChange={(e) => setProductoData({ ...productoData, clave: e.target.value })}
            />

            <label>Descripción</label>
            <textarea
              value={productoData.descripcion}
              onChange={(e) => setProductoData({ ...productoData, descripcion: e.target.value })}
            />

            <label>Moneda:</label>
                <select
                value={productoData.moneda_id}
                onChange={(e) => setProductoData({ ...productoData, moneda: e.target.value })}
                required
                >
                <option value="" disabled>Seleccione una moneda</option>
                {monedas.map(moneda => (
                    <option key={moneda.id} value={moneda.id}>
                        {moneda.nombre}
                    </option>
                ))}
            </select>

            <label>Estado</label>
            <select
              value={productoData.estado}
              onChange={(e) => setProductoData({ ...productoData, estado: parseInt(e.target.value, 10) })}
            >
              <option value={0}>Inactivo</option>
              <option value={1}>Activo</option>
            </select>
              <div className="modal-buttons">
                <button onClick={handleNext}>Siguiente</button>
                <button onClick={onClose}>Cancelar</button>
              </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Políticas y Requisitos</h2>

            <label>Edad Mínima</label>
            <input
              type="number"
              value={productoData.politicas_requisitos?.edad_minima || ''}
              onChange={(e) => setProductoData({
                ...productoData,
                politicas_requisitos: {
                  ...productoData.politicas_requisitos,
                  edad_minima: e.target.value
                }
              })}
            />

            <label>Edad Máxima</label>
            <input
              type="number"
              value={productoData.politicas_requisitos?.edad_maxima || ''}
              onChange={(e) => setProductoData({
                ...productoData,
                politicas_requisitos: {
                  ...productoData.politicas_requisitos,
                  edad_maxima: e.target.value
                }
              })}
            />

            <label>Monto Mínimo</label>
            <input
              type="number"
              value={productoData.politicas_requisitos?.monto_minimo || ''}
              onChange={(e) => setProductoData({
                ...productoData,
                politicas_requisitos: {
                  ...productoData.politicas_requisitos,
                  monto_minimo: e.target.value
                }
              })}
            />

            <label>Monto Máximo</label>
            <input
              type="number"
              value={productoData.politicas_requisitos?.monto_maximo || ''}
              onChange={(e) => setProductoData({
                ...productoData,
                politicas_requisitos: {
                  ...productoData.politicas_requisitos,
                  monto_maximo: e.target.value
                }
              })}
            />
            <div className="modal-buttons">
              <button onClick={handlePrevious}>Anterior</button>
              <button onClick={handleNext}>Siguiente</button>
              <button onClick={onClose}>Cancelar</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Políticas de Interés</h2>

            <label>Fecha de Inicio</label>
            <input
              type="date"
              value={productoData.politicas_interes?.fecha_inicio || ''}
              onChange={(e) => setProductoData({
                ...productoData,
                politicas_interes: {
                  ...productoData.politicas_interes,
                  fecha_inicio: e.target.value
                }
              })}
            />

            <label>Fecha de Fin</label>
            <input
              type="date"
              value={productoData.politicas_interes?.fecha_fin || ''}
              onChange={(e) => setProductoData({
                ...productoData,
                politicas_interes: {
                  ...productoData.politicas_interes,
                  fecha_fin: e.target.value
                }
              })}
            />

            <label>Periodo de Capitalización</label>
            <input
              type="text"
              value={productoData.politicas_interes?.periodo_capitalizacion || ''}
              onChange={(e) => setProductoData({
                ...productoData,
                politicas_interes: {
                  ...productoData.politicas_interes,
                  periodo_capitalizacion: e.target.value
                }
              })}
            />

            <label>Tasa de Interés</label>
            <input
              type="number"
              step="0.001"
              value={productoData.politicas_interes?.tasa_interes || ''}
              onChange={(e) => setProductoData({
                ...productoData,
                politicas_interes: {
                  ...productoData.politicas_interes,
                  tasa_interes: e.target.value
                }
              })}
            />
            <div className="modal-buttons">
              <button type="button" onClick={handlePrevious}>Anterior</button>
              <button type="button" onClick={handleSave}>Guardar</button>
              <button type="button" onClick={onClose}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductosAhorroForm;
