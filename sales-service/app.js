const express = require('express');
const authMiddleware = require('./middleware/auth');
const roleMiddleware = require('./middleware/role');
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
                cliente,
                producto,
                cantidad,
                precio_unitario,
                estado
            } = req.body;

            const total =
                Number(cantidad) *
                Number(precio_unitario);

            const [result] = await db.execute(
                `
                INSERT INTO sales
                (
                    cliente,
                    producto,
                    cantidad,
                    precio_unitario,
                    total,
                    estado
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    cliente,
                    producto,
                    cantidad,
                    precio_unitario,
                    total,
                    estado
                ]
            );

            res.json({
                id: result.insertId,
                cliente,
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

            await db.execute(
                'DELETE FROM sales WHERE id = ?',
                [req.params.id]
            );

            res.json({
                message: 'Venta eliminada'
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