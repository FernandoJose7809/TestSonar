import React, { useState, useEffect } from 'react';
import { Apiurl } from '../services/apirest';
import './RolesCRUD.css'; 
import RoleForm from './RoleForm';

const RolesCRUD = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar la lista de roles
  useEffect(() => {
    fetch(`${Apiurl}roles/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => setRoles(data))
      .catch(error => console.error('Error fetching roles:', error));
  }, []);

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    fetch(`${Apiurl}roles/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          setRoles(roles.filter(role => role.id !== id));
        }
      })
      .catch(error => console.error('Error deleting role:', error));
  };

  const handleCreate = () => {
    setSelectedRole({ name: '', permissions: [] });
    setIsModalOpen(true);
  };

  const handleSave = (roleData) => {
    const method = roleData.id ? 'PUT' : 'POST';
    const url = roleData.id ? `${Apiurl}roles/${roleData.id}/` : `${Apiurl}roles/`;

    fetch(url, {
      method: method,
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(roleData)
    })
      .then(response => response.json())
      .then(data => {
        if (roleData.id) {
          setRoles(roles.map(role => (role.id === data.id ? data : role)));
        } else {
          setRoles([...roles, data]);
        }
        setIsModalOpen(false);
      })
      .catch(error => console.error('Error saving role:', error));
  };

  return (
    <div className="roles-container">
      <h1>Roles</h1>
      <button onClick={handleCreate}>Crear Rol</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(role)}>Editar</button>
                <button className="delete-btn" onClick={() => handleDelete(role.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <RoleForm
          role={selectedRole}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default RolesCRUD;
