import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './componentes/Login/Login';
import Dashboard from './componentes/Dashboard/Dashboard';
import PrivateRoute from './componentes/PrivateRoute';
import Home from './pages/Home/Home';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserList from './componentes/UserList/UserList';
import RegisterClientWrapper from './componentes/RegisterClient/RegisterClient';
import ClientList from './componentes/RegisterClient/ClientList';
import UsersCRUD from './componentes/Usuarios/UsersCRUD';
import RegisterUserWrapper from './componentes/Usuarios/RegisterUser';
import RolesCRUD from './componentes/Roles/RolesCRUD';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductosAhorroCRUD from './componentes/ProductosAhorro/ProductosAhorroCRUD'
import Caja from './componentes/Caja/Caja';
import AbrirCaja from './componentes/Caja/AbrirCaja';




function App() {
  return (
    <Router>
      <Routes>
        {/* Definir la ruta para el componente Login */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Ruta para el componente Dashboard (protegido tras login) */}
        <Route path="/abrircaja" element={<AbrirCaja />} />

        <Route path="/caja" element={<Caja />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          {/* Rutas hijas dentro de Dashboard */}
          <Route path="caja" element={<Caja />} />

          <Route path="users" element={<UsersCRUD />} />
            {/* Rutas para roles */}
            <Route path="roles" element={<RolesCRUD />} />
          <Route path="register" element={<RegisterUserWrapper />} />
          {/* Rutas para Clientes */}
          <Route path="RegisterClient" element={<RegisterClientWrapper />} />
          <Route path="ClientList" element={<ClientList />} />

          <Route path='ProductosAhorroList' element={<ProductosAhorroCRUD/>}/>
        </Route>

        {/* Rutas fuera del Dashboard */}
        <Route path="/RegisterUser" element={<PrivateRoute><RegisterUserWrapper /></PrivateRoute>} />
        <Route path="/UserList" element={<PrivateRoute><UserList /></PrivateRoute>} />


        {/* Ruta comodín para redirigir a Home si la URL no existe */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
