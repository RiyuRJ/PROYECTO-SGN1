import { useState } from 'react';

import './auth.css';

import {
    login,
    saveToken
} from './authService';

function Login() {

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const handleLogin = async () => {

        const data = await login(email, password);

        if(data.token){

            saveToken(
                data.token,
                data.role,
                data.email
            );

            window.location.href = '/';

        }else{

            alert('Credenciales incorrectas');
        }
    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h1>SGN Login</h1>

                <input
                    className="login-input"
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="login-input"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="login-button"
                    onClick={handleLogin}
                >
                    Iniciar sesión
                </button>

            </div>

        </div>

    );
}

export default Login;