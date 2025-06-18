import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import RecuperarContrasena from "../pages/RecContra";
import ProtectedByRole from "./ProtectedByRole";
//CLiente
import ClienteDashboard from '../pages/cliente/ClienteDashboard';
//Admin
import AdminLayout from '../components/layouts/admin/AdminLayout';
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductos from '../pages/admin/AdminProductos';
import AdminUsuarios from '../pages/admin/AdminCliente';

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/recuperar" element={<RecuperarContrasena />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/home" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } />
            <Route path="/cliente/dashboard" element={
                <ProtectedByRole allowed={["cliente"]}>
                    <ClienteDashboard />
                </ProtectedByRole>
            } />
            <Route path="/admin" element={
                <ProtectedByRole allowed={["admin"]}>
                    <AdminLayout />
                </ProtectedByRole>
            }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="productos" element={<AdminProductos />} />
                <Route path="cliente" element={<AdminUsuarios />} />
            </Route>
        </Routes>
    );
}
