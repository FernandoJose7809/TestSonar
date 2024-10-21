import React, { useState, useEffect } from 'react';
import { Apiurl } from '../services/apirest';
import './ProductosAhorroCRUD.css'; 
import AhorroProductoForm from './ProductosAhorroForm';

const ProductosAhorroCRUD = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar la lista de productos de ahorro
  useEffect(() => {
    fetch(`${Apiurl}producto-ahorro/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error fetching productos:', error));
  }, []);

  const handleEdit = (producto) => {
    setSelectedProducto(producto);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    fetch(`${Apiurl}productos/ahorro/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          setProductos(productos.filter(producto => producto.id !== id));
        }
      })
      .catch(error => console.error('Error deleting producto:', error));
  };

  const createPoliticasRequisitos = (politicasRequisitosData) => {
    return fetch(`${Apiurl}politicas-requisitos/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(politicasRequisitosData)
    }).then(response => response.json());
  };

  const createPoliticasInteres = (politicasInteresData) => {
    return fetch(`${Apiurl}politicas-interes/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(politicasInteresData)
    }).then(response => response.json());
  };

  const handleCreate = () => {
    setSelectedProducto({ descripcion: '', estado: 0, nombre: '', clave: '', politicas_interes_id: '', politicas_requisitos_id:'' });
    setIsModalOpen(true);
  };

  const handleSave = async (productoData, politicasRequisitos, politicasInteres) => {
    try {
      // Crear politicas de requisitos
      const politicasRequisitos = productoData.politicas_requisitos; 
      const politicasInteres = productoData.politicas_interes; 
      const politicasRequisitosResponse = await createPoliticasRequisitos(politicasRequisitos);
  
      // Crear politicas de interés
      const politicasInteresResponse = await createPoliticasInteres(politicasInteres);
  
      // Asignar los IDs de politicas al producto de ahorro
      const productoFinalData = {
        ...productoData,
        politicas_requisitos_id: politicasRequisitosResponse.id, // ID de políticas de requisitos
        politicas_interes_id: politicasInteresResponse.id, // ID de políticas de interés
      };
      console.log(productoFinalData)
  
      const method = productoData.id ? 'PUT' : 'POST';
      const url = productoData.id ? `${Apiurl}producto-ahorro/${productoData.id}/` : `${Apiurl}producto-ahorro/`;
      fetch(url, {
        method: method,
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productoFinalData) // Aquí se envía el producto con las políticas asociadas
      })
        .then(response => response.json())
        .then(data => {
          if (productoData.id) {
            setProductos(productos.map(producto => (producto.id === data.id ? data : producto)));
          } else {
            setProductos([...productos, data]);
          }
          setIsModalOpen(false);
        })
        .catch(error => console.error('Error saving producto:', error));
    } catch (error) {
      console.error('Error creating producto:', error);
    }
  };

  return (
    <div className="productos-container">
      <h1>Productos de Ahorro</h1>
      <button onClick={handleCreate}>Crear Producto de Ahorro</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Clave</th>
            <th>Moneda</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.clave}</td>
              <td>{producto.moneda.nombre}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(producto)}>Editar</button>
                <button className="delete-btn" onClick={() => handleDelete(producto.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <AhorroProductoForm
          producto={selectedProducto}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductosAhorroCRUD;
