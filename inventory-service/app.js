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
    stock: Number
});

const Product = mongoose.model('Product', ProductSchema);

app.get('/', (req, res) => {
    res.send('Inventory Service funcionando');
});

app.get('/products', authMiddleware, roleMiddleware('admin', 'gerente'), async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post('/products', authMiddleware, roleMiddleware('admin', 'gerente'), async (req, res) => {

    const product = new Product({
        nombre: req.body.nombre,
        stock: req.body.stock
    });

    await product.save();

    res.json(product);
});

app.put('/products/:id',
    authMiddleware,
    roleMiddleware('admin', 'gerente'),
    async (req, res) => {

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre,
                stock: req.body.stock
            },
            { new: true }
        );

        res.json(product);
    }
);

app.delete('/products/:id',
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