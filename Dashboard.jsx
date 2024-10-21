import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './Dashboard.css';
import logo from '../imagenes/logo1.jpeg';
import { useState } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    fetch('http://127.0.0.1:8000/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          localStorage.removeItem('token');
          window.location.reload();
        }
      })
      .catch(error => console.error('Error al hacer logout:', error));
  };

  const navigateHome = () => {
    navigate('/dashboard'); // Navega a la página principal
  };

  const navigateToUsers = () => {
    navigate('/dashboard/users'); // Navega a la página de gestión de usuarios
  };

  const navigateToRoles = () => {
    navigate('/dashboard/roles'); // Navega a la página de gestión de roles
  };


  const navigateToClientList = () => {
    navigate('/dashboard/ClientList'); // Navega a ClientList.jsx
  };

  const navigateToProducts = () => {
    navigate('/dashboard/ProductosAhorroList'); // Navega a ClientList.jsx
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <nav className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
        <ul>
          <li><a href="#home" onClick={navigateHome}>Inicio</a></li>
          <li><a href="#profile">Perfil</a></li>
          <li><a href="#settings">Configuración</a></li>
          <li><Link to="/UserList">Usuarios</Link></li> {/* Enlace a UserList */}
          <li><a href="#logout" onClick={handleLogout}>Cerrar sesión</a></li>
        </ul>
      </nav>

      {/* Main content del dashboard */}
      <div className="main-content">
        <div className='dashboard-header'>
          {/* Navbar */}
          <Navbar expand="lg" className="full-width-navbar">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            {/* Botón para contraer el sidebar */}
            <button className="toggle-btn-navbar" onClick={toggleSidebar}>
            {isSidebarCollapsed ? '>' : '<'}
            </button>

            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <NavDropdown title="Administración" id="admin-dropdown">
                  <NavDropdown.Item onClick={navigateToUsers}>Gestión de usuarios</NavDropdown.Item>
                  <NavDropdown.Item onClick={navigateToRoles}>Gestión de roles</NavDropdown.Item>
                </NavDropdown>

                {/* Nuevo dropdown para Clientes */}
                <NavDropdown title="Clientes" id="clients-dropdown">
                  <NavDropdown.Item onClick={navigateToClientList}>Clientes</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Productos" id="products-dropdown">
                  <NavDropdown.Item onClick={navigateToProducts}>Productos de ahorro</NavDropdown.Item>
                </NavDropdown>

                <Nav.Link onClick={handleLogout}>Cerrar sesión</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>

        {/* Aquí se renderiza el contenido del Outlet */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
