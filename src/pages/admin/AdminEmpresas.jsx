import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
    getEmpresas,
    addEmpresa,
    updateEmpresa,
    deleteEmpresa,
    registrarEmpresaConAuth,
} from "../../services/EmpresaFirebase";

export default function AdminEmpresas() {
    const [empresas, setEmpresas] = useState([]);
    const [empresaActiva, setEmpresaActiva] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        direccion: '',
        comuna: '',
        email: '',
        telefono: '',
        password: ''
    });

    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const soloNumeros = /^[0-9]{9}$/;

    const cargarEmpresas = async () => {
        const data = await getEmpresas();
        setEmpresas(data);
    };

    const validarRut = (rut) => {
        const rutLimpio = rut.replace(/[\.\-]/g, '').toUpperCase();
        if (!/^[0-9]+[0-9K]$/.test(rutLimpio)) return false;

        let cuerpo = rutLimpio.slice(0, -1);
        let dv = rutLimpio.slice(-1);

        let suma = 0, multiplo = 2;
        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
            multiplo = multiplo === 7 ? 2 : multiplo + 1;
        }

        let dvEsperado = 11 - (suma % 11);
        dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
        return dv === dvEsperado;
    };

    const validarFormulario = () => {
        if (!formData.nombre.match(soloLetras) || formData.nombre.length < 3 || formData.nombre.length > 30) {
            Swal.fire("Error", "El nombre debe tener entre 3 y 30 letras.", "error");
            return false;
        }
        if (!formData.comuna.match(soloLetras) || formData.comuna.length < 3 || formData.comuna.length > 30) {
            Swal.fire("Error", "La comuna debe tener entre 3 y 30 letras.", "error");
            return false;
        }
        if (!soloNumeros.test(formData.telefono)) {
            Swal.fire("Error", "El teléfono debe contener exactamente 9 dígitos.", "error");
            return false;
        }
        if (!validarRut(formData.rut)) {
            Swal.fire("Error", "El RUT ingresado no es válido.", "error");
            return false;
        }
        if (!empresaActiva && (!formData.password || formData.password.length < 6)) {
            Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres.", "error");
            return false;
        }
        return true;
    };

    const guardar = async () => {
        if (!validarFormulario()) return;

        if (empresaActiva) {
            const { password, email, ...rest } = formData;
            await updateEmpresa(empresaActiva.id, rest);
        } else {
            await registrarEmpresaConAuth(formData);
        }

        setShowModal(false);
        setFormData({
            nombre: '', rut: '', direccion: '', comuna: '',
            email: '', telefono: '', password: ''
        });
        cargarEmpresas();
    };

    const eliminar = async (id) => {
        const result = await Swal.fire({
            title: "¿Eliminar empresa?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí",
        });
        if (result.isConfirmed) {
            await deleteEmpresa(id);
            cargarEmpresas();
        }
    };

    useEffect(() => {
        cargarEmpresas();
    }, []);

    return (
        <div className="container mt-4">
            <h3 className="text-center">Empresas Registradas</h3>
            <div className="text-center">
                <button className="btn btn-success mb-3" onClick={() => {
                    setEmpresaActiva(null);
                    setFormData({
                        nombre: '', rut: '', direccion: '', comuna: '',
                        email: '', telefono: '', password: ''
                    });
                    setShowModal(true);
                }}>
                    Nueva Empresa
                </button>
            </div>

            <table className="table table-bordered text-center">
                <thead className="table-light">
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Ubicación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empresas.map((e) => (
                        <tr key={e.id}>
                            <td>{e.nombre}</td>
                            <td>{e.email}</td>
                            <td>{e.comuna}, {e.direccion}</td>
                            <td>
                                <button className="btn btn-primary btn-sm me-2" onClick={() => {
                                    setEmpresaActiva(e);
                                    setFormData({ ...e, password: '' });
                                    setShowModal(true);
                                }}>Editar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => eliminar(e.id)}>Eliminar</button>
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
                                <h5 className="modal-title">{empresaActiva ? "Editar Empresa" : "Nueva Empresa"}</h5>
                            </div>
                            <div className="modal-body">
                                <input className="form-control mb-2" placeholder="Nombre"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    maxLength={30} minLength={3} pattern={soloLetras.source} />

                                <input className="form-control mb-2" placeholder="RUT"
                                    value={formData.rut}
                                    onChange={(e) => setFormData({ ...formData, rut: e.target.value.toUpperCase() })}
                                    maxLength={12} minLength={8} />

                                <input className="form-control mb-2" placeholder="Dirección"
                                    value={formData.direccion}
                                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                    maxLength={50} minLength={5} />

                                <input className="form-control mb-2" placeholder="Comuna"
                                    value={formData.comuna}
                                    onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                                    maxLength={30} minLength={3} pattern={soloLetras.source} />

                                <input className="form-control mb-2" placeholder="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    maxLength={40} minLength={5} disabled={empresaActiva !== null} />

                                <input className="form-control mb-2" placeholder="Teléfono"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/[^0-9]/g, '') })}
                                    maxLength={9} minLength={9} pattern="\d{9}" />

                                {!empresaActiva && (
                                    <input className="form-control mb-2" placeholder="Contraseña"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        maxLength={30} minLength={6} required pattern=".{6,}" />
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
