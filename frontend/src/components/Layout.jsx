import { Link } from 'react-router-dom';
import { logout, getRole, getEmail } from '../auth/authService';
import { useState } from 'react';

import './layout.css';


function Layout({ children }) {

    const [menuOpen, setMenuOpen] = useState(false);

    const [inventoryOpen, setInventoryOpen] = useState(false);

    const role = getRole();

    const email = getEmail();

    const handleLogout = () => {

        logout();

        window.location.href = '/login';
    };

    return (

        <div className="layout">

            <div className={`app-sidebar ${menuOpen ? 'active' : ''}`}>

                <button
                    className="close-menu"
                    onClick={() => setMenuOpen(false)}
                >
                    ✕
                </button>

                <nav className="app-sidebar-menu">

                    <Link to="/">Inicio</Link>

                    {role === 'admin' && (
                        <Link to="/usuarios">
                            Usuarios
                        </Link>
                    )}

                    <div className="menu-group">

                        <button
                            className="submenu-btn"
                            onClick={() => setInventoryOpen(!inventoryOpen)}
                        >
                            <span>Inventario</span>

                            <span>
                                {inventoryOpen ? '▼' : '▶'}
                            </span>
                        </button>

                        {inventoryOpen && (

                            <div className="submenu">

                                <Link to="/inventario">
                                    Todos
                                </Link>

                                <Link to="/inventario/insumos">
                                    Insumos
                                </Link>

                                <Link to="/inventario/productos">
                                    Productos
                                </Link>

                            </div>

                        )}

                    </div>

                    <Link to="/clientes">
                        Clientes
                    </Link>

                    <Link to="/ventas">
                        Ventas
                    </Link>

                </nav>

            </div>

            <div className="main-area">

                <header className="top-navbar">

                    <button
                        className="menu-btn"
                        onClick={() => setMenuOpen(true)}
                    >
                        ☰
                    </button>

                    <div className="navbar-right">

                        <span>Usuario: {email}</span>

                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Salir
                        </button>

                    </div>

                </header>

                <main className="content">

                    {children}

                </main>

            </div>

        </div>

    );
}

export default Layout;