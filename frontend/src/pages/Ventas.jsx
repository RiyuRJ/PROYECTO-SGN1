import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import './css/Ventas.css';

import {
    getSales,
    createSale,
    updateSale,
    deleteSale
} from '../services/salesService';

function Ventas() {

    const [sales, setSales] = useState([]);

    const [cliente, setCliente] = useState('');
    const [producto, setProducto] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precioUnitario, setPrecioUnitario] = useState('');
    const [estado, setEstado] = useState('Pendiente');

    const [showModal, setShowModal] = useState(false);
    const [editingSale, setEditingSale] = useState(null);
    const [editEstado, setEditEstado] = useState('');

    const loadSales = async () => {

        const data = await getSales();

        setSales(data);
    };

    const handleCreate = async () => {

        await createSale({

            cliente,
            producto,
            cantidad: Number(cantidad),
            precio_unitario: Number(precioUnitario),
            estado

        });

        setCliente('');
        setProducto('');
        setCantidad('');
        setPrecioUnitario('');

        loadSales();
    };

    const handleEdit = (sale) => {

        setEditingSale(sale);

        setEditEstado(sale.estado);

        setShowModal(true);
    };

    const handleUpdate = async () => {

        await updateSale(
            editingSale.id,
            {
                estado: editEstado
            }
        );

        setShowModal(false);

        loadSales();
    };

    const handleDelete = async (id) => {

        if(!window.confirm('¿Eliminar venta?')) return;

        await deleteSale(id);

        loadSales();
    };

    useEffect(() => {

        loadSales();

    }, []);

    return (

        <Layout>

            <div style={{ padding: '40px' }}>

                <h1 className="page-title">
                    Ventas
                </h1>

                <div className="create-sale-card">

                    <h2>Crear Venta</h2>

                    <div className="create-sale-form">

                        <input
                            placeholder="Cliente"
                            value={cliente}
                            onChange={(e) =>
                                setCliente(e.target.value)
                            }
                        />

                        <input
                            placeholder="Producto"
                            value={producto}
                            onChange={(e) =>
                                setProducto(e.target.value)
                            }
                        />

                        <input
                            type="number"
                            placeholder="Cantidad"
                            value={cantidad}
                            onChange={(e) =>
                                setCantidad(e.target.value)
                            }
                        />

                        <input
                            type="number"
                            placeholder="Precio Unitario"
                            value={precioUnitario}
                            onChange={(e) =>
                                setPrecioUnitario(e.target.value)
                            }
                        />

                        <select
                            value={estado}
                            onChange={(e) =>
                                setEstado(e.target.value)
                            }
                        >
                            <option value="Pendiente">
                                Pendiente
                            </option>

                            <option value="Completada">
                                Completada
                            </option>
                        </select>

                        <button
                            className="create-btn"
                            onClick={handleCreate}
                        >
                            Crear Venta
                        </button>

                    </div>

                </div>

                <div className="sales-table-container">

                    <h2>Lista de Ventas</h2>

                    <table className="sales-table">

                        <thead>

                            <tr>

                                <th>Cliente</th>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Acciones</th>

                            </tr>

                        </thead>

                        <tbody>

                            {sales.map(sale => (

                                <tr key={sale.id}>

                                    <td>{sale.cliente}</td>

                                    <td>{sale.producto}</td>

                                    <td>{sale.cantidad}</td>

                                    <td>{sale.precio_unitario}</td>

                                    <td>{sale.total}</td>

                                    <td>{sale.estado}</td>

                                    <td>

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                handleEdit(sale)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(sale.id)
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

                        <h2>Actualizar Estado</h2>

                        <select
                            value={editEstado}
                            onChange={(e) =>
                                setEditEstado(e.target.value)
                            }
                        >
                            <option value="Pendiente">
                                Pendiente
                            </option>

                            <option value="Completada">
                                Completada
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

export default Ventas;