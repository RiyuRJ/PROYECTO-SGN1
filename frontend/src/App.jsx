import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import Login from './auth/Login';

import Home from './pages/Home';

import Usuarios from './pages/Usuarios';

import Inventario from './pages/Inventario';

import ProtectedRoute from './routes/ProtectedRoute';

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/usuarios"
                    element={
                        <ProtectedRoute>
                            <Usuarios />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/inventario"
                    element={<Inventario filtro="todos" />}
                />

                <Route
                    path="/inventario/insumos"
                    element={<Inventario filtro="insumo" />}
                />

                <Route
                    path="/inventario/productos"
                    element={<Inventario filtro="producto" />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/" />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;