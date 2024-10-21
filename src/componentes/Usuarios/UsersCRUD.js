import React, { useEffect, useState } from 'react';
import { Apiurl } from '../services/apirest';
import './UsersCRUD.css';
import { useNavigate } from 'react-router-dom'; 

const UsersCRUD = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar la lista de usuarios
    fetch(`${Apiurl}usuarios`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => setUsers(data))
    .catch(error => console.error('Error fetching users:', error));

    // Cargar la lista de roles
    fetch(`${Apiurl}roles/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => setRoles(data))
    .catch(error => console.error('Error fetching roles:', error));
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true); // Abre el modal al hacer clic en editar
  };

  const handleDelete = (id) => {
    fetch(`${Apiurl}usuarios/${id}/`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
      }
    })
    .catch(error => console.error('Error deleting user:', error));
  };

  const handleSave = () => {
    const method = selectedUser.id ? 'PUT' : 'POST';
    const url = selectedUser.id ? `${Apiurl}usuarios/${selectedUser.id}/` : `${Apiurl}usuarios/`;

    fetch(url, {
      method: method,
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: selectedUser.username,
        email: selectedUser.email,
        password: selectedUser.password,
        groups: selectedUser.groups
      })
    })
    .then(response => response.json())
    .then(data => {
      if (selectedUser.id) {
        setUsers(users.map(user => (user.id === selectedUser.id ? data : user)));
      } else {
        setUsers([...users, data]);
      }
      setSelectedUser(null);
      setIsModalOpen(false); // Cierra el modal después de guardar
    })
    .catch(error => console.error('Error saving user:', error));
  };

  const handleRegisterUser = () => {
    setSelectedUser({ username: '', email: '', password: '', groups: [] });
    setIsModalOpen(true); // Abre el modal al registrar un nuevo usuario
  };

  // Para evitar que el modal se cierre al hacer clic en el contenido del modal
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="uses-container">
      <h1>Usuarios</h1>
      <button className="register-btn" onClick={handleRegisterUser}>Registrar Usuario</button>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.groups.join(', ')}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(user)}>Editar</button>
                <button className="delete-btn" onClick={() => handleDelete(user.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={handleModalContentClick}>
            <h2>{selectedUser.id ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <label>Username</label>
            <input 
              type="text" 
              value={selectedUser.username} 
              onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})} 
            />
            <label>Email</label>
            <input 
              type="email" 
              value={selectedUser.email} 
              onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})} 
            />
            <label>Password</label>
            <input 
              type="password" 
              value={selectedUser.password} 
              onChange={(e) => setSelectedUser({...selectedUser, password: e.target.value})} 
            />
            <label>Rol</label>
            <select
              value={selectedUser.groups[0] || ''}
              onChange={(e) => setSelectedUser({...selectedUser, groups: [e.target.value]})}
            >
              <option value="">Seleccione un rol</option>
              {roles.map(role => (
                <option key={role.id} value={role.name}>{role.name}</option>
              ))}
            </select>
            <div className="modal-buttons">                               
              <button onClick={handleSave}>Guardar</button>
              <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersCRUD;