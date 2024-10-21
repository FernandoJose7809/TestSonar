import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaDollarSign, FaMobileAlt, FaShieldAlt, FaUsers } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';  // Asegúrate de tener Bootstrap instalado
import './Home.css';  // Estilos personalizados

const Home = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="home-container text-center mt-5">
            <header className="home-header mb-5">
                <h1 className="display-4">Core Banking - UAGRM</h1>
                <p className="lead">Transforme la gestión financiera de su entidad con nuestro sistema innovador.</p>
            </header>

            <section className="row text-center home-features mb-5">
                <Feature 
                    icon={<FaDollarSign size={50} className="feature-icon"/>} 
                    title="Gestión Integral" 
                    description="Administre todas sus operaciones bancarias en un solo lugar." 
                />
                <Feature 
                    icon={<FaMobileAlt size={50} className="feature-icon"/>} 
                    title="Banca Móvil" 
                    description="Acceda a su sistema desde cualquier dispositivo, en cualquier momento." 
                />
                <Feature 
                    icon={<FaShieldAlt size={50} className="feature-icon"/>} 
                    title="Seguridad Avanzada" 
                    description="Proteja sus transacciones con nuestras avanzadas soluciones de seguridad." 
                />
                <Feature 
                    icon={<FaUsers size={50} className="feature-icon"/>} 
                    title="Gestión de Clientes" 
                    description="Mejore las relaciones con los clientes con herramientas eficientes." 
                />
            </section>

            <button className="btn btn-lg btn-primary home-button" onClick={handleLoginRedirect}>
                Iniciar Sesión
            </button>
        </div>
    );
};

const Feature = ({ icon, title, description }) => {
    return (
        <div className="col-md-3 mb-4 feature-item">
            <div>{icon}</div>
            <h3 className="feature-title mt-3">{title}</h3>
            <p className="feature-description">{description}</p>
        </div>
    );
};

export default Home;
