const express = require('express');

const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const PORT = 3003;

const JWT_SECRET = 'SGN_SECRET_KEY';

mongoose.connect('mongodb://mongo-auth:27017/authdb')
    .then(() => {
        console.log('Mongo Auth conectado');
    })
    .catch((error) => {
        console.log(error);
    });

const UserSchema = new mongoose.Schema({

    email: String,

    password: String,

    role: String

});

const User = mongoose.model('User', UserSchema);

/* REGISTER */

app.post('/register', async (req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({

        email: req.body.email,

        password: hashedPassword,

        role: req.body.role

    });

    await user.save();

    res.json({
        message: 'Usuario registrado'
    });

});

/* LOGIN */

app.post('/login', async (req, res) => {

    const user = await User.findOne({
        email: req.body.email
    });

    if(!user){

        return res.status(401).json({
            message: 'Usuario no encontrado'
        });
    }

    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if(!validPassword){

        return res.status(401).json({
            message: 'Contraseña incorrecta'
        });
    }

    const token = jwt.sign({

        id: user._id,

        email: user.email,

        role: user.role

    },
    JWT_SECRET,
    {
        expiresIn: '1d'
    });

    res.json({
        token,
        role: user.role,
        email: user.email
    });

});

app.listen(PORT, () => {

    console.log(`Auth Service ejecutándose en puerto ${PORT}`);

});