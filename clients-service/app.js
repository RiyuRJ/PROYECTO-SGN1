const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/auth');
const roleMiddleware = require('./middleware/role');

const app = express();

app.use(express.json());

const PORT = 3004;

mongoose.connect('mongodb://mongo-clients:27017/clientsdb')
    .then(() => {
        console.log('MongoDB Clients conectado');
    })
    .catch((error) => {
        console.log(error);
    });

const ClientSchema = new mongoose.Schema({
    nombre: String,
    documento: String,
    telefono: String,
    correo: String,
    direccion: String,
    ciudad: String,
    estado: {
        type: String,
        default: 'Activo'
    },

    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

const Client = mongoose.model('Client', ClientSchema);

app.get('/', (req, res) => {
    res.send('Clients Service funcionando');
});

app.get(
    '/clients',
    authMiddleware,
    roleMiddleware('admin', 'gerente', 'vendedor'),
    async (req, res) => {

        const clients = await Client.find();

        res.json(clients);
    }
);

app.post(
    '/clients',
    authMiddleware,
    roleMiddleware('admin', 'gerente', 'vendedor'),
    async (req, res) => {

        const client = new Client({
            nombre: req.body.nombre,
            documento: req.body.documento,
            telefono: req.body.telefono,
            correo: req.body.correo,
            direccion: req.body.direccion,
            ciudad: req.body.ciudad
        });

        await client.save();

        res.json(client);
    }
);

app.put(
    '/clients/:id',
    authMiddleware,
    roleMiddleware('admin', 'gerente', 'vendedor'),
    async (req, res) => {

        const client = await Client.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre,
                documento: req.body.documento,
                telefono: req.body.telefono,
                correo: req.body.correo,
                direccion: req.body.direccion,
                ciudad: req.body.ciudad,
                estado: req.body.estado
            },
            { new: true }
        );

        res.json(client);
    }
);

app.delete(
    '/clients/:id',
    authMiddleware,
    roleMiddleware('admin', 'gerente'),
    async (req, res) => {

        await Client.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Cliente eliminado'
        });
    }
);

app.listen(PORT, () => {
    console.log(`Clients Service ejecutándose en puerto ${PORT}`);
});