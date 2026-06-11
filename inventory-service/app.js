const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/auth');
const roleMiddleware = require('./middleware/role');

const app = express();

app.use(express.json());

const PORT = 3002;

mongoose.connect('mongodb://mongo-inventory:27017/inventorydb')
    .then(() => {
        console.log('MongoDB Inventory conectado');
    })
    .catch((error) => {
        console.log(error);
    });

const ProductSchema = new mongoose.Schema({
    nombre: String,
    stock: Number,
    precio: Number,
    categoria: String
});

const Product = mongoose.model('Product', ProductSchema);

app.get('/', (req, res) => {
    res.send('Inventory Service funcionando');
});

app.get(
    '/products',
    authMiddleware,
    roleMiddleware('admin', 'gerente'),
    async (req, res) => {

        const products = await Product.find();

        res.json(products);
    }
);

app.get(
    '/products/:id',
    authMiddleware,
    roleMiddleware('admin', 'gerente'),
    async (req, res) => {

        const product =
            await Product.findById(
                req.params.id
            );

        res.json(product);
    }
);

app.post(
    '/products',
    authMiddleware,
    roleMiddleware('admin', 'gerente'),
    async (req, res) => {

        const product = new Product({
            nombre: req.body.nombre,
            stock: req.body.stock,
            precio: req.body.precio,
            categoria: req.body.categoria
        });

        await product.save();

        res.json(product);
    }
);

app.put(
    '/products/:id',
    authMiddleware,
    roleMiddleware('admin', 'gerente'),
    async (req, res) => {

        const currentProduct =
            await Product.findById(
                req.params.id
            );

        if (!currentProduct) {

            return res.status(404).json({
                error: 'Producto no encontrado'
            });
        }

        const product =
            await Product.findByIdAndUpdate(
                req.params.id,
                {
                    nombre:
                        req.body.nombre ??
                        currentProduct.nombre,

                    stock:
                        req.body.stock ??
                        currentProduct.stock,

                    precio:
                        req.body.precio ??
                        currentProduct.precio,

                    categoria:
                        req.body.categoria ??
                        currentProduct.categoria
                },
                {
                    new: true
                }
            );

        res.json(product);
    }
);

app.delete(
    '/products/:id',
    authMiddleware,
    roleMiddleware('admin', 'gerente'),
    async (req, res) => {

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Producto eliminado'
        });
    }
);

app.listen(PORT, () => {
    console.log(`Inventory Service ejecutándose en puerto ${PORT}`);
});