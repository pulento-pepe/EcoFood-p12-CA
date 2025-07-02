import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
    getClientes,
    addCliente,
    updateCliente,
    deleteCliente,
    registrarClienteConAuth
} from "../../services/ClienteFirebase";

export default function AdminClientes() {
    const [clientes, setClientes] = useState([]);
    const [clienteActivo, setClienteActivo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ nombre: "", email: "", comuna: "", password: "" });

    const cargarClientes = async () => {
        const data = await getClientes();
        setClientes(data.filter(c => c.tipo === 'cliente'));
    };

    const validarFormulario = () => {
        const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

        if (!formData.nombre.match(soloLetras) || formData.nombre.length < 3 || formData.nombre.length > 30) {
            Swal.fire("Error", "El nombre debe contener solo letras (3-30 caracteres).", "error");
            return false;
        }
        if (!formData.comuna.match(soloLetras) || formData.comuna.length < 3 || formData.comuna.length > 30) {
            Swal.fire("Error", "La comuna debe contener solo letras (3-30 caracteres).", "error");
            return false;
        }
        if (!clienteActivo && (!formData.password || formData.password.length < 6)) {
            Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres.", "error");
            return false;
        }
        return true;
    };

    const guardar = async () => {
        if (!validarFormulario()) return;

        if (clienteActivo) {
            await updateCliente(clienteActivo.id, formData);
        } else {
            await registrarClienteConAuth(formData);
        }

        setShowModal(false);
        setFormData({ nombre: "", email: "", comuna: "", password: "" });
        cargarClientes();
    };

    const eliminar = async (id) => {
        const result = await Swal.fire({
            title: "¿Eliminar cliente?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí",
        });
        if (result.isConfirmed) {
            await deleteCliente(id);
            cargarClientes();
        }
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    return (
        <div className="container mt-4">
            <h3 className="text-center">Clientes Registrados</h3>
            <div className="text-center">
                <button className="btn btn-success mb-3" onClick={() => {
                    setClienteActivo(null);
                    setFormData({ nombre: "", email: "", comuna: "", password: "" });
                    setShowModal(true);
                }}>
                    Nuevo Cliente
                </button>
            </div>

            <table className="table table-bordered text-center">
                <thead className="table-light">
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Comuna</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((c) => (
                        <tr key={c.id}>
                            <td>{c.nombre}</td>
                            <td>{c.email}</td>
                            <td>{c.comuna}</td>
                            <td>
                                <button className="btn btn-primary btn-sm me-2" onClick={() => {
                                    setClienteActivo(c);
                                    setFormData({ ...c, password: "" }); // vacía la contraseña por seguridad
                                    setShowModal(true);
                                }}>Editar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => eliminar(c.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{clienteActivo ? "Editar Cliente" : "Nuevo Cliente"}</h5>
                            </div>
                            <div className="modal-body">
                                <input
                                    className="form-control mb-2"
                                    placeholder="Nombre"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} maxLength={30} minLength={3} pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$" title="El nombre debe contener solo letras (3-30 caracteres)"
                                />
                                <input
                                    className="form-control mb-2"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} maxLength={40} minLength={5} type="email" title="El email debe ser válido" disabled={clienteActivo ? true : false}
                                />
                                <input
                                    className="form-control mb-2"
                                    placeholder="Comuna"
                                    value={formData.comuna}
                                    onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}maxLength={30} minLength={3} pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$" title="La comuna debe contener solo letras (3-30 caracteres)"
                                />
                                {!clienteActivo && (
                                    <input
                                        type="password"
                                        className="form-control mb-2"
                                        placeholder="Contraseña"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} maxLength={30} minLength={6} title="La contraseña debe tener al menos 6 caracteres" required={!clienteActivo} pattern=".{6,}"
                                    />
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button className="btn btn-success" onClick={guardar}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
