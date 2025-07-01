import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import RecContra from '../pages/RecContra';
import CerrarSesion from '../pages/CerrarSesion';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminEmpresas from '../pages/admin/AdminEmpresas';
import AdminClientes from '../pages/admin/AdminCliente';
import AdminAdministradores from '../pages/admin/AdminAdministradores';

// Rutas protegidas
import ProtectedByRole from './ProtectedByRole';

import AdminLayout from '../components/layouts/admin/AdminLayout';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recuperar" element={<RecContra />} />
            <Route path="/cerrarsesion" element={<CerrarSesion />} />

            <Route path="/admin" element={
                <ProtectedByRole allowed={["admin"]}>
                    <AdminLayout />
                </ProtectedByRole>
                }>
                <Route path="" element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="dash" element={<AdminDashboard />} />
                <Route path="d" element={<AdminDashboard />} />
                <Route path="empresas" element={<AdminEmpresas />} />
                <Route path="clientes" element={<AdminClientes />} />
                <Route path="administradores" element={<AdminAdministradores />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;