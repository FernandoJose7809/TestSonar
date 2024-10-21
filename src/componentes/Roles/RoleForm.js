import React, { useState, useEffect } from 'react';
import { Apiurl } from '../services/apirest';
import './RoleForm.css';

const RoleForm = ({ role, onSave, onClose }) => {
  const [roleData, setRoleData] = useState(role);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    // Cargar la lista de permisos
    fetch(`${Apiurl}permisos/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => setPermissions(data))
      .catch(error => console.error('Error fetching permissions:', error));
  }, []);

  const handleSave = () => {
    onSave(roleData);
  };

  const handlePermissionChange = (e, permissionId) => {
    if (e.target.checked) {
      setRoleData({
        ...roleData,
        permissions: [...roleData.permissions, permissionId]
      });
    } else {
      setRoleData({
        ...roleData,
        permissions: roleData.permissions.filter(id => id !== permissionId)
      });
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{roleData.id ? 'Editar Rol' : 'Nuevo Rol'}</h2>
        <label>Nombre del Rol</label>
        <input
          type="text"
          value={roleData.name}
          onChange={(e) => setRoleData({ ...roleData, name: e.target.value })}
        />

        <label>Permisos</label>
        <div className="permissions-list">
          {permissions.map(permission => (
            <div key={permission.id}>
              <input
                type="checkbox"
                checked={roleData.permissions.includes(permission.id)}
                onChange={(e) => handlePermissionChange(e, permission.id)}
              />
              <label>{permission.name}</label>
            </div>
          ))}
        </div>

        <button onClick={handleSave}>Guardar</button>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default RoleForm;
