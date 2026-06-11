import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import './css/Inventario.css';

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../services/inventoryService';

function Inventario({ filtro = 'todos' }) {

    const [products, setProducts] = useState([]);

    const [nombre, setNombre] = useState('');

    const [stock, setStock] = useState('');
    
    const [precio, setPrecio] = useState('');

    const [showModal, setShowModal] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);

    const [editNombre, setEditNombre] = useState('');

    const [editStock, setEditStock] = useState('');

    const [editPrecio, setEditPrecio] = useState('');

    const [categoria, setCategoria] = useState('');

    const [editCategoria, setEditCategoria] = useState('');

    const filteredProducts = products.filter(product => {

        if (filtro === 'todos')
            return true;

        return product.categoria === filtro;
    });

    const loadProducts = async () => {

        const data = await getProducts();

        setProducts(data);
    };

    const handleCreate = async () => {

        await createProduct({
            nombre,
            stock: Number(stock),
            precio: Number(precio),
            categoria
        });

        setNombre('');
        setStock('');
        setPrecio('')
        setCategoria('');

        loadProducts();
    };

    const handleEdit = (product) => {

        setEditingProduct(product);

        setEditNombre(product.nombre);

        setEditStock(product.stock);

        setEditPrecio(product.precio)

        setEditCategoria(product.categoria);

        setShowModal(true);
    };

    const handleUpdate = async () => {

        await updateProduct(
            editingProduct._id,
            {
                nombre: editNombre,
                stock: Number(editStock),
                precio: Number(editPrecio),
                categoria: editCategoria
            }
        );

        setShowModal(false);

        loadProducts();
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            '¿Eliminar producto?'
        );

        if (!confirmed) return;

        await deleteProduct(id);

        loadProducts();
    };

    useEffect(() => {

        loadProducts();

    }, []);

    const pageTitle =
    filtro === 'insumo'
        ? 'Insumos'
        : filtro === 'producto'
            ? 'Productos'
            : 'Inventario';

    return (

        <Layout>

            <div style={{ padding: '40px' }}>

                <h1 className="page-title">
                    {pageTitle}
                </h1>

                <div className="create-product-card">

                    <h2>Crear Producto</h2>

                    <div className="create-product-form">

                        <input
                            placeholder="Nombre producto"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Stock"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Precio"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                        />

                        <select
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                        >
                            <option value="">Seleccione categoría</option>
                            <option value="insumo">Insumo</option>
                            <option value="producto">Producto</option>
                        </select>

                        <button
                            className="create-btn"
                            onClick={handleCreate}
                        >
                            Crear Producto
                        </button>

                    </div>

                </div>

                <div className="products-table-container">

                    <h2>Lista de Productos</h2>

                    <table className="products-table">

                        <thead>

                            <tr>

                                <th>Producto</th>

                                <th>Stock</th>

                                <th>Precio</th>
                                
                                <th>Categoria</th>

                                <th>Acciones</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredProducts.map(product => (

                                <tr key={product._id}>

                                    <td>{product.nombre}</td>

                                    <td>{product.stock}</td>

                                    <td>${product.precio}</td>

                                    <td>{product.categoria}</td>

                                    <td>

                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(product._id)
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

                        <h2>Editar Producto</h2>

                        <input
                            value={editNombre}
                            onChange={(e) =>
                                setEditNombre(e.target.value)
                            }
                        />

                        <input
                            type="number"
                            value={editStock}
                            onChange={(e) =>
                                setEditStock(e.target.value)
                            }
                        />

                        <input
                            type="number"
                            value={editPrecio}
                            onChange={(e) =>
                                setEditPrecio(e.target.value)
                            }
                        />

                        <select
                            value={editCategoria}
                            onChange={(e) =>
                                setEditCategoria(e.target.value)
                            }
                        >
                            <option value="insumo">
                                Insumo
                            </option>

                            <option value="producto">
                                Producto
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

export default Inventario;