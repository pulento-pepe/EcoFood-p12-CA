import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
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
    {/*const [tipo, setTipo] = useState("cliente");*/}
    

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

        if (!passwordRegex.test(password)) {
            Swal.fire(
                "Contraseña inválida",
                "La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un signo.",
                "warning"
            );
            return;
        }

        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);

            // Enviar verificación de correo
            await sendEmailVerification(cred.user);

            // Guardar datos en Firestore solo si el correo fue enviado correctamente
            await saveUserData(cred.user.uid, {
                nombre,
                direccion,
                comuna,
                telefono,
                tipo:'cliente',
                email,
                emailVerified: false
            });

            Swal.fire(
                "¡Registro exitoso!",
                "Usuario creado correctamente. Revisa tu correo para verificar tu cuenta antes de iniciar sesión.",
                "success"
            );

            navigate("/login");

        } catch (error) {
            console.error("Error al registrar:", error);
            let mensaje = "No se pudo registrar el usuario.";

            if (error.code === "auth/email-already-in-use") {
                mensaje = "Este correo ya está en uso.";
            } else if (error.code === "auth/invalid-email") {
                mensaje = "El correo ingresado no es válido.";
            } else if (error.code === "auth/weak-password") {
                mensaje = "La contraseña es demasiado débil.";
            }

            Swal.fire("Error", mensaje, "error");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Registro</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input type="text" className="form-control" value={nombre}
                        onChange={(e) => setNombre(e.target.value)} maxLength={50}required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input type="email" className="form-control" value={email}
                        onChange={(e) => setEmail(e.target.value)} maxLength={40} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input type="password" className="form-control" value={password}
                        onChange={(e) => setPassword(e.target.value)} maxLength={12}required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input type="text" className="form-control" value={direccion}
                        onChange={(e) => setDireccion(e.target.value)} maxLength={50}required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Comuna</label>
                    <input type="text" className="form-control" value={comuna}
                        onChange={(e) => setComuna(e.target.value)} maxLength={50} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                        <input
                            type="text"
                            className="form-control"
                            value={telefono}
                            onChange={(e) => {
                                const numericValue = e.target.value.replace(/\D/g, ''); // Elimina cualquier carácter no numérico
                                setTelefono(numericValue);
                            }}
                            minLength={9}
                            maxLength={9}
                            pattern="\d{9}" // Asegura que solo se acepten 9 dígitos
                            required
                        />
                </div>
                 {/*<div className="mb-3">
                    <label className="form-label">Tipo de usuario</label>
                    <select className="form-select" disabled value={tipo} onChange={(e) =>
                        setTipo(e.target.value)}>
                        <option value="cliente">Cliente</option>
                        <option value="empresa" disabled>Empresa</option>
                        <option value="admin" disabled>Administrador</option>
                    </select>
                </div>*/}
                <button type="submit" className="btn btn-success">Registrar</button>
            </form>
        </div>
    );
}
