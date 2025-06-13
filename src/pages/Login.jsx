import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../services/userService";
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    signOut
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

            // ⚠️ Verificar si el correo está verificado
            if (!cred.user.emailVerified) {
                await signOut(auth); // Cerrar sesión inmediatamente
                Swal.fire(
                    "Correo no verificado",
                    "Debes verificar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.",
                    "warning"
                );
                return;
            }

            const datos = await getUserData(cred.user.uid);
            console.log("Bienvenido", datos.nombre, "Tipo:", datos.tipo);
            navigate("/home");

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            let mensaje = "Credenciales incorrectas.";

            if (error.code === "auth/user-not-found") {
                mensaje = "Usuario no registrado.";
            } else if (error.code === "auth/wrong-password") {
                mensaje = "Contraseña incorrecta.";
            } else if (error.code === "auth/invalid-email") {
                mensaje = "Correo no válido.";
            }

            Swal.fire("Error", mensaje, "error");
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
            </form>
        </div>
    );
}
