import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { getEmpresaById, updateEmpresa } from "../../services/empresaService";

export default function PerfilEmpresa() {
    const { userData } = useAuth();
    const [perfil, setPerfil] = useState({
        nombre: "",
        correo: "",
        ubicacion: ""
    });

    useEffect(() => {
        if (userData) {
            getEmpresaById(userData.uid).then(data => {
                setPerfil({
                    nombre: data.nombre || "",
                    correo: data.email || "",
                    ubicacion: data.ubicacion || ""
                });
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        setPerfil({ ...perfil, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await updateEmpresa(userData.uid, {
            nombre: perfil.nombre,
            ubicacion: perfil.ubicacion
        });
        Swal.fire("Perfil actualizado", "", "success");
    };

    return (
        <div className="container mt-4">
            <h3>Perfil Empresarial</h3>
            <form onSubmit={handleSave}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" name="nombre" value={perfil.nombre} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input className="form-control" value={perfil.correo} disabled />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ubicación</label>
                    <input className="form-control" name="ubicacion" value={perfil.ubicacion} onChange={handleChange} required />
                </div>
                <button className="btn btn-success" type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
}