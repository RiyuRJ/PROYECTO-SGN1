import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import './css/Ventas.css';
import { getClients } from '../services/clientsService';
import { getProducts } from '../services/inventoryService';

import {
    getSales,
    createSale,
    updateSale,
    deleteSale
} from '../services/salesService';

function Ventas() {

    const [sales, setSales] = useState([]);

    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);

    const [clienteId, setClienteId] = useState('');
    const [productoId, setProductoId] = useState('');

    const [cliente, setCliente] = useState('');
    const [producto, setProducto] = useState('');

    const [cantidad, setCantidad] = useState('');
    const [precioUnitario, setPrecioUnitario] = useState('');

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [estado, setEstado] = useState('Pendiente');

    const [showModal, setShowModal] = useState(false);
    const [editingSale, setEditingSale] = useState(null);
    const [editEstado, setEditEstado] = useState('');

    const loadSales = async () => {

        const data = await getSales();

        setSales(data);
    };

    const loadClients = async () => {

    const data = await getClients();
        setClients(data);
    };

    const loadProducts = async () => {
        const data = await getProducts();
        setProducts(data);
    };

    const handleCreate = async () => {
        if (!clienteId) {

            alert('Seleccione un cliente');

            return;
        }

        if (!selectedProduct) {

            alert('Seleccione un producto');

            return;
        }

        if (
            Number(cantidad) >
            selectedProduct.stock
        ) {

            alert('Stock insuficiente');

            return;
        }

        await createSale({

            cliente_id: clienteId,

            cliente,

            producto_id: productoId,

            producto,

            cantidad: Number(cantidad),

            precio_unitario:
                Number(selectedProduct.precio),

            estado

        });

        await loadProducts();

        await loadSales();

        setCliente('');
        setProducto('');
        setClienteId('');
        setProductoId('');
        setCantidad('');
        setPrecioUnitario('');
        setSelectedProduct(null);
        setEstado('Pendiente');
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

    const handleProductChange = (productId) => {
        setProductoId(productId);

        const selected = products.find(
            product => product._id === productId
        );

        if (!selected) return;

        setSelectedProduct(selected);

        setProducto(selected.nombre);

        setPrecioUnitario(selected.precio);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            '¿Eliminar venta?'
        );

        if (!confirmed) return;

        await deleteSale(id);

        await loadProducts();

        await loadSales();

        if (
            selectedProduct &&
            selectedProduct._id === productoId
        ) {

            const updatedProducts =
                await getProducts();

            const updatedProduct =
                updatedProducts.find(
                    product =>
                        product._id === productoId
                );

            setSelectedProduct(
                updatedProduct || null
            );
        }
    };

    useEffect(() => {

        loadSales();

        loadClients();

        loadProducts();

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

                        <select
                            value={clienteId}
                            onChange={(e) => {

                                const selected = clients.find(
                                    client => client._id === e.target.value
                                );

                                setClienteId(e.target.value);

                                setCliente(selected.nombre);
                            }}
                        >

                            <option value="">
                                Seleccione Cliente
                            </option>

                            {clients.map(client => (

                                <option
                                    key={client._id}
                                    value={client._id}
                                >
                                    {client.nombre}
                                </option>

                            ))}

                        </select>

                        <select
                            value={productoId}
                            onChange={(e) =>
                                handleProductChange(e.target.value)
                            }
                        >

                            <option value="">
                                Seleccione Producto
                            </option>

                            {products.map(product => (

                                <option
                                    key={product._id}
                                    value={product._id}
                                >
                                    {product.nombre}
                                </option>

                            ))}

                        </select>

                        {selectedProduct && (

                            <div>

                                <p>
                                    Stock disponible:
                                    {selectedProduct.stock}
                                </p>

                                <p>
                                    Precio:
                                    ${selectedProduct.precio}
                                </p>

                            </div>

                        )}

                        <input
                            type="number"
                            placeholder="Cantidad"
                            value={cantidad}
                            onChange={(e) =>
                                setCantidad(e.target.value)
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