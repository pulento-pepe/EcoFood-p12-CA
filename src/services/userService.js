// src/services/userService.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Obtiene los datos del usuario desde Firestore (puede estar en "usuarios" o "empresas")
 * @param {string} uid - ID del usuario (auth.uid)
 */
export const getUserData = async (uid) => {
    try {
        // Buscar en la colección "usuarios"
        const userRef = doc(db, "usuarios", uid);
        let snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
            return { id: snapshot.id, ...snapshot.data(), tipo: "cliente" };
        }

        // Si no se encuentra, buscar en la colección "empresas"
        const empresaRef = doc(db, "empresas", uid);
        snapshot = await getDoc(empresaRef);

        if (snapshot.exists()) {
            return { id: snapshot.id, ...snapshot.data(), tipo: "empresa" };
        }

        throw new Error("Usuario no encontrado en Firestore");
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        throw error;
    }
};

/**
 * Guarda los datos del usuario en la colección "usuarios"
 * @param {string} uid
 * @param {object} data - {nombre, tipo, email}
 */
export const saveUserData = async (uid, data) => {
    try {
        await setDoc(doc(db, "usuarios", uid), data);
    } catch (error) {
        console.error("Error al guardar usuario:", error);
        throw error;
    }
};
