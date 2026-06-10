import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import './css/Usuarios.css';

import {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from '../services/usersService';

function Usuarios() {

    const [users, setUsers] = useState([]);

    const [nombre, setNombre] = useState('');

    const [rol, setRol] = useState('');

    const [showModal, setShowModal] = useState(false);

    const [editingUser, setEditingUser] = useState(null);

    const [editNombre, setEditNombre] = useState('');

    const [editRol, setEditRol] = useState('');

    const loadUsers = async () => {

        const data = await getUsers();

        setUsers(data);
    };

    const handleCreate = async () => {

        await createUser({
            nombre,
            rol
        });

        setNombre('');
        setRol('');

        loadUsers();
    };

    const handleEdit = (user) => {

        setEditingUser(user);

        setEditNombre(user.nombre);

        setEditRol(user.rol);

        setShowModal(true);
    };

    const handleUpdate = async () => {

        await updateUser(
            editingUser._id,
            {
                nombre: editNombre,
                rol: editRol
            }
        );

        setShowModal(false);

        loadUsers();
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            '¿Eliminar usuario?'
        );

        if(!confirmed) return;

        await deleteUser(id);

        loadUsers();
    };

    useEffect(() => {

        loadUsers();

    }, []);

    return (

        <Layout>

            <div style={{ padding: '40px' }}>

                <h1 className="page-title">
                    Usuarios
                </h1>
                
                <br />

                <div className="create-user-card">

                    <h2>Crear Usuario</h2>

                    <div className="create-user-form">

                        <input
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />

                        <select
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                        >
                            <option value="">Seleccione Rol</option>
                            <option value="Admin">Administrador</option>
                            <option value="Gerente">Gerente</option>
                            <option value="Vendedor">Vendedor</option>
                            <option value="Operador">Operador</option>
                        </select>

                        <button
                            className="create-btn"
                            onClick={handleCreate}
                        >
                            Crear Usuario
                        </button>

                    </div>

                </div>

                <br /><br />

                <div className="users-table-container">

                    <h2>Lista de Usuarios</h2>

                    <table className="users-table">

                        <thead>

                            <tr>

                                <th>Nombre</th>

                                <th>Rol</th>

                                <th>Acciones</th>

                            </tr>

                        </thead>

                        <tbody>

                            {users.map(user => (

                                <tr key={user._id}>

                                    <td>{user.nombre}</td>

                                    <td>{user.rol}</td>

                                    <td>

                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(user)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Eliminar
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            {showModal && (

                <div className="modal-overlay">

                    <div className="modal">

                        <h2>Editar Usuario</h2>

                        <input
                            value={editNombre}
                            onChange={(e) =>
                                setEditNombre(e.target.value)
                            }
                        />

                        <input
                            value={editRol}
                            onChange={(e) =>
                                setEditRol(e.target.value)
                            }
                        />

                        <div className="modal-actions">

                            <button
                                className="save-btn"
                                onClick={handleUpdate}
                            >
                                Guardar
                            </button>

                            <button
                                className="cancel-btn"
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                Cancelar
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </Layout>

    );
}

export default Usuarios;