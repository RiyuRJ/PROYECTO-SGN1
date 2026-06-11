const express = require('express');
const authMiddleware = require('./middleware/auth');
const roleMiddleware = require('./middleware/role');
const axios = require('axios');
const db = require('./db');

const app = express();

app.use(express.json());

const PORT = 3005;

app.get('/', (req, res) => {
    res.send('Sales Service funcionando');
});

app.get(
    '/sales',
    authMiddleware,
    roleMiddleware('admin', 'gerente', 'vendedor'),
    async (req, res) => {

        try {

            const [rows] = await db.execute(
                'SELECT * FROM sales ORDER BY fecha_venta DESC'
            );

            res.json(rows);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: 'Error obteniendo ventas'
            });
        }
    }
);

app.post(
    '/sales',
    authMiddleware,
    roleMiddleware('admin', 'gerente', 'vendedor'),
    async (req, res) => {

        try {

            const {
                cliente_id,
                cliente,
                producto_id,
                producto,
                cantidad,
                precio_unitario,
                estado
            } = req.body;

            const productResponse = await axios.get(
                `http://inventory-service:3002/products/${producto_id}`,
                {
                    headers: {
                        authorization:
                            req.headers.authorization
                    }
                }
            );

            const currentProduct =
                productResponse.data;

            if (
                currentProduct.stock <
                Number(cantidad)
            ) {

                return res.status(400).json({
                    error: 'Stock insuficiente'
                });
            }

            await axios.put(
                `http://inventory-service:3002/products/${producto_id}`,
                {
                    stock:
                        currentProduct.stock -
                        Number(cantidad)
                },
                {
                    headers: {
                        authorization:
                            req.headers.authorization
                    }
                }
            );

            const total =
                Number(cantidad) *
                Number(precio_unitario);

            const [result] = await db.execute(
                `
                INSERT INTO sales
                (
                    cliente_id,
                    cliente,
                    producto_id,
                    producto,
                    cantidad,
                    precio_unitario,
                    total,
                    estado
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    cliente_id,
                    cliente,
                    producto_id,
                    producto,
                    cantidad,
                    precio_unitario,
                    total,
                    estado
                ]
            );

            res.json({
                id: result.insertId,
                cliente_id,
                cliente,
                producto_id,
                producto,
                cantidad,
                precio_unitario,
                total,
                estado
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: 'Error creando venta'
            });
        }
    }
);

app.put(
    '/sales/:id',
    authMiddleware,
    roleMiddleware('admin', 'gerente'),
    async (req, res) => {

        try {

            await db.execute(
                `
                UPDATE sales
                SET estado = ?
                WHERE id = ?
                `,
                [
                    req.body.estado,
                    req.params.id
                ]
            );

            const [rows] = await db.execute(
                'SELECT * FROM sales WHERE id = ?',
                [req.params.id]
            );

            res.json(rows[0]);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: 'Error actualizando venta'
            });
        }
    }
);

app.delete(
    '/sales/:id',
    authMiddleware,
    roleMiddleware('admin'),
    async (req, res) => {

        try {

            const [rows] = await db.execute(
                'SELECT * FROM sales WHERE id = ?',
                [req.params.id]
            );

            if (!rows.length) {

                return res.status(404).json({
                    error: 'Venta no encontrada'
                });
            }

            const sale = rows[0];

            const productResponse =
                await axios.get(
                    `http://inventory-service:3002/products/${sale.producto_id}`,
                    {
                        headers: {
                            authorization:
                                req.headers.authorization
                        }
                    }
                );

            const currentProduct =
                productResponse.data;

            await axios.put(
                `http://inventory-service:3002/products/${sale.producto_id}`,
                {
                    stock:
                        currentProduct.stock +
                        Number(sale.cantidad)
                },
                {
                    headers: {
                        authorization:
                            req.headers.authorization
                        }
                    
                }
            );

            await db.execute(
                'DELETE FROM sales WHERE id = ?',
                [req.params.id]
            );

            res.json({
                message:
                    'Venta eliminada y stock restaurado'
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: 'Error eliminando venta'
            });
        }
    }
);

app.listen(PORT, () => {
    console.log(
        `Sales Service ejecutándose en puerto ${PORT}`
    );
});