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
    navigate('/dashboard');
  };

  const navigateToUsers = () => {
    navigate('/dashboard/users');
  };

  const navigateToRoles = () => {
    navigate('/dashboard/roles');
  };

  const navigateToClientList = () => {
    navigate('/dashboard/ClientList');
  };

  const navigateToProducts = () => {
    navigate('/dashboard/ProductosAhorroList');
  };

  const navigateToCaja = () => {
    navigate('/dashboard/caja');
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
          <li><a href="#home" onClick={navigateHome}><i className="bi bi-house-door"></i> <span>Inicio</span></a></li>
          <li><a href="#profile"><i className="bi bi-person-circle"></i> <span>Perfil</span></a></li>
          <li><a href="#settings"><i className="bi bi-gear"></i> <span>Configuración</span></a></li>
          <li><Link to="/dashboard/users"><i className="bi bi-people"></i> <span>Usuarios</span></Link></li>
          <li><a href="#logout" onClick={handleLogout}><i className="bi bi-box-arrow-right"></i> <span>Cerrar sesión</span></a></li>
        </ul>
      </nav>

      {/* Navbar */}
      <div className="dashboard-header">
        <Navbar expand="lg" className="full-width-navbar">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <button className="toggle-btn-navbar" onClick={toggleSidebar}>
            {isSidebarCollapsed ? '>' : '<'}
          </button>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown title={<><i className="bi bi-bank2"></i> Administración</>} id="admin-dropdown">
                <NavDropdown.Item onClick={navigateToUsers}><i className="bi bi-people"></i> Gestión de usuarios</NavDropdown.Item>
                <NavDropdown.Item onClick={navigateToRoles}><i className="bi bi-shield-lock"></i> Gestión de roles</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title={<><i className="bi bi-person"></i> Clientes</>} id="clients-dropdown">
                <NavDropdown.Item onClick={navigateToClientList}><i className="bi bi-person-lines-fill"></i> Clientes</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title={<><i className="bi bi-box"></i> Productos</>} id="products-dropdown">
                <NavDropdown.Item onClick={navigateToProducts}><i className="bi bi-piggy-bank"></i> Productos de ahorro</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

      {/* Main content del dashboard */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
