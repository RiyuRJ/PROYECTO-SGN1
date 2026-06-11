import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import './css/Clientes.css';


import {
    getClients,
    createClient,
    updateClient,
    deleteClient
} from '../services/clientsService';

function Clientes() {

    const [clients, setClients] = useState([]);

    const [nombre, setNombre] = useState('');
    const [documento, setDocumento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ciudad, setCiudad] = useState('');

    const [showModal, setShowModal] = useState(false);

    const [editingClient, setEditingClient] = useState(null);

    const [editNombre, setEditNombre] = useState('');
    const [editDocumento, setEditDocumento] = useState('');
    const [editTelefono, setEditTelefono] = useState('');
    const [editCorreo, setEditCorreo] = useState('');
    const [editDireccion, setEditDireccion] = useState('');
    const [editCiudad, setEditCiudad] = useState('');
    const [editEstado, setEditEstado] = useState('');

    const loadClients = async () => {

        const data = await getClients();

        setClients(data);
    };

    const handleCreate = async () => {

        await createClient({

            nombre,
            documento,
            telefono,
            correo,
            direccion,
            ciudad

        });

        setNombre('');
        setDocumento('');
        setTelefono('');
        setCorreo('');
        setDireccion('');
        setCiudad('');

        loadClients();
    };

    const handleEdit = (client) => {

        setEditingClient(client);

        setEditNombre(client.nombre || '');
        setEditDocumento(client.documento || '');
        setEditTelefono(client.telefono || '');
        setEditCorreo(client.correo || '');
        setEditDireccion(client.direccion || '');
        setEditCiudad(client.ciudad || '');
        setEditEstado(client.estado || 'Activo');

        setShowModal(true);
    };

    const handleUpdate = async () => {

        await updateClient(
            editingClient._id,
            {
                nombre: editNombre,
                documento: editDocumento,
                telefono: editTelefono,
                correo: editCorreo,
                direccion: editDireccion,
                ciudad: editCiudad,
                estado: editEstado
            }
        );

        setShowModal(false);

        loadClients();
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            '¿Eliminar cliente?'
        );

        if (!confirmed) return;

        await deleteClient(id);

        loadClients();
    };

    useEffect(() => {

        loadClients();

    }, []);

    return (

        <Layout>

            <div style={{ padding: '40px' }}>

                <h1 className="page-title">
                    Clientes
                </h1>

                <div className="create-client-card">

                    <h2>Crear Cliente</h2>

                    <div className="create-client-form">

                        <input
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) =>
                                setNombre(e.target.value)
                            }
                        />

                        <input
                            placeholder="Documento"
                            value={documento}
                            onChange={(e) =>
                                setDocumento(e.target.value)
                            }
                        />

                        <input
                            placeholder="Teléfono"
                            value={telefono}
                            onChange={(e) =>
                                setTelefono(e.target.value)
                            }
                        />

                        <input
                            placeholder="Correo"
                            value={correo}
                            onChange={(e) =>
                                setCorreo(e.target.value)
                            }
                        />

                        <input
                            placeholder="Dirección"
                            value={direccion}
                            onChange={(e) =>
                                setDireccion(e.target.value)
                            }
                        />

                        <input
                            placeholder="Ciudad"
                            value={ciudad}
                            onChange={(e) =>
                                setCiudad(e.target.value)
                            }
                        />

                        <button
                            className="create-btn"
                            onClick={handleCreate}
                        >
                            Crear Cliente
                        </button>

                    </div>

                </div>

                <div className="clients-table-container">

                    <h2>Lista de Clientes</h2>

                    <table className="clients-table">

                        <thead>

                            <tr>

                                <th>Nombre</th>

                                <th>Documento</th>

                                <th>Teléfono</th>

                                <th>Correo</th>

                                <th>Ciudad</th>

                                <th>Estado</th>

                                <th>Acciones</th>

                            </tr>

                        </thead>

                        <tbody>

                            {clients.map(client => (

                                <tr key={client._id}>

                                    <td>{client.nombre}</td>

                                    <td>{client.documento}</td>

                                    <td>{client.telefono}</td>

                                    <td>{client.correo}</td>

                                    <td>{client.ciudad}</td>

                                    <td>

                                        <span
                                            className={`client-status ${client.estado?.toLowerCase()}`}
                                        >
                                            {client.estado}
                                        </span>

                                    </td>

                                    <td>

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                handleEdit(client)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(client._id)
                                            }
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

                        <h2>Editar Cliente</h2>

                        <input
                            value={editNombre}
                            onChange={(e) =>
                                setEditNombre(e.target.value)
                            }
                            placeholder="Nombre"
                        />

                        <input
                            value={editDocumento}
                            onChange={(e) =>
                                setEditDocumento(e.target.value)
                            }
                            placeholder="Documento"
                        />

                        <input
                            value={editTelefono}
                            onChange={(e) =>
                                setEditTelefono(e.target.value)
                            }
                            placeholder="Teléfono"
                        />

                        <input
                            value={editCorreo}
                            onChange={(e) =>
                                setEditCorreo(e.target.value)
                            }
                            placeholder="Correo"
                        />

                        <input
                            value={editDireccion}
                            onChange={(e) =>
                                setEditDireccion(e.target.value)
                            }
                            placeholder="Dirección"
                        />

                        <input
                            value={editCiudad}
                            onChange={(e) =>
                                setEditCiudad(e.target.value)
                            }
                            placeholder="Ciudad"
                        />

                        <select
                            value={editEstado}
                            onChange={(e) =>
                                setEditEstado(e.target.value)
                            }
                        >
                            <option value="Activo">
                                Activo
                            </option>

                            <option value="Inactivo">
                                Inactivo
                            </option>
                        </select>

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

export default Clientes;