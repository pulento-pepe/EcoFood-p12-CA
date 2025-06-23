import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../services/userService";
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await setPersistence(auth, browserLocalPersistence);
            const cred = await signInWithEmailAndPassword(auth, email, password);
            if (!cred.user.emailVerified) {
                Swal.fire("Verificación requerida", "Debes verificar tu correo antes de ingresar.", "warning");
                return;
            }
            const datos = await getUserData(cred.user.uid);
            if (datos.tipo === "admin") navigate("/admin/dashboard");
            else if (datos.tipo === "cliente") navigate("/cliente/dashboard");
        } catch (error) {
            Swal.fire("Error", "Credenciales incorrectas", "error");
        }
    };
        

    const handleForgotPassword = async () => {
        const { value: emailReset } = await Swal.fire({
            title: "¿Olvidaste tu contraseña?",
            input: "email",
            inputLabel: "Ingresa tu correo electrónico",
            inputPlaceholder: "correo@ejemplo.com",
            showCancelButton: true,
            confirmButtonText: "Enviar correo",
            cancelButtonText: "Cancelar",
        });

        if (emailReset) {
            try {
                await sendPasswordResetEmail(auth, emailReset);
                Swal.fire("Correo enviado", "Revisa tu bandeja de entrada", "success");
            } catch (error) {
                Swal.fire("Error", "No se pudo enviar el correo", "error");
                console.error("Error enviando email de recuperación:", error);
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Iniciar Sesión
                </button>
                <button
                    type="button"
                    className="btn btn-link"
                    onClick={handleForgotPassword}
                >
                    ¿Olvidó su contraseña?
                </button>
            </form>
        </div>
    );
}
