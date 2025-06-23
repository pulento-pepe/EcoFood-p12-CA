// ✅ AppRouter.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import RecContra from '../pages/RecContra';
import CerrarSesion from '../pages/CerrarSesion';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminEmpresas from '../pages/admin/AdminEmpresas';
import AdminClientes from '../pages/admin/AdminClientes';
import AdminAdministradores from '../pages/admin/AdminAdministradores';

// Rutas protegidas
import ProtectedByRole from './ProtectedByRole';

import NavAdmin from '../components/layouts/admin/NavAdmin';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recuperar" element={<RecContra />} />
                <Route path="/cerrarsesion" element={<CerrarSesion />} />

                <Route
                    path="/admin"
                    element={
                        <ProtectedByRole role="admin">
                            <NavAdmin />
                            <AdminDashboard />
                        </ProtectedByRole>
                    }
                />

                <Route
                    path="/admin/empresas"
                    element={
                        <ProtectedByRole role="admin">
                            <NavAdmin />
                            <AdminEmpresas />
                        </ProtectedByRole>
                    }
                />

                <Route
                    path="/admin/clientes"
                    element={
                        <ProtectedByRole role="admin">
                            <NavAdmin />
                            <AdminClientes />
                        </ProtectedByRole>
                    }
                />

                <Route
                    path="/admin/administradores"
                    element={
                        <ProtectedByRole role="admin">
                            <NavAdmin />
                            <AdminAdministradores />
                        </ProtectedByRole>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRouter;
