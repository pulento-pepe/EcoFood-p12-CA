import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/userService";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [comuna, setComuna] = useState("");
    const [telefono, setTelefono] = useState("");

    const [tipo, setTipo] = useState("cliente");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await saveUserData(cred.user.uid, { nombre, tipo, email });
            Swal.fire("Registrado", "Usuario creado correctamente", "success");
            navigate("/login");
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            Swal.fire("Error", "No se pudo registrar", "error");
        }
    }

    return (
        <div className="container mt-5">
            <h2>Registro</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input type="text" className="form-control" value={nombre}
                    onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input type="email" className="form-control" value={email} 
                    onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input type="password" className="form-control" value={password}
                    onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Direccion</label>
                    <input type="password" className="form-control" value={direccion}
                    onChange={(e) => setDireccion(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Comuna</label>
                    <input type="password" className="form-control" value={comuna}
                    onChange={(e) => setComuna(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Telefono</label>
                    <input type="password" className="form-control" value={telefono}
                    onChange={(e) => setTelefono(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tipo de usuario</label>
                    <select className="form-select" value={tipo} onChange={(e) =>
                    setTipo(e.target.value)}>
                        <option value="cliente">Cliente</option>
                        <option value="empresa">Empresa</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-success">Registrar</button>
            </form>
        </div>
    );
}