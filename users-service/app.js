const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/auth');
const roleMiddleware = require('./middleware/role');

const app = express();

app.use(express.json());

const PORT = 3001;

mongoose.connect('mongodb://mongo-users:27017/usersdb')
    .then(() => {
        console.log('MongoDB conectado');
    })
    .catch((error) => {
        console.log(error);
    });

const UserSchema = new mongoose.Schema({
    nombre: String,
    rol: String
});

const User = mongoose.model('User', UserSchema);

app.get('/', (req, res) => {
    res.send('Users Service funcionando');
});

app.get('/users', authMiddleware, async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.post('/users', authMiddleware, roleMiddleware('admin'), async (req, res) => {

    const user = new User({
        nombre: req.body.nombre,
        rol: req.body.rol
    });

    await user.save();

    res.json(user);
});

app.put('/users/:id',
    authMiddleware,
    roleMiddleware('admin'),
    async (req, res) => {

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre,
                rol: req.body.rol
            },
            { new: true }
        );

        res.json(user);
    }
);

app.delete('/users/:id',
    authMiddleware,
    roleMiddleware('admin'),
    async (req, res) => {

        await User.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Usuario eliminado'
        });
    }
);

app.listen(PORT, () => {
    console.log(`Users Service ejecutándose en puerto ${PORT}`);
});