import { db, secondaryAuth } from "./firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import {
    collection, query, getDocs, addDoc,
    updateDoc, deleteDoc, setDoc, doc
} from "firebase/firestore";

// Obtener todas las empresas
export const getEmpresas = async () => {
    const q = query(collection(db, "empresas"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Agregar empresa manualmente (sin auth)
export const addEmpresa = async (empresaData) => {
    return await addDoc(collection(db, "empresas"), empresaData);
};

// Actualizar datos de empresa
export const updateEmpresa = async (id, empresaData) => {
    const ref = doc(db, "empresas", id);
    return await updateDoc(ref, empresaData);
};

// Eliminar empresa
export const deleteEmpresa = async (id) => {
    const ref = doc(db, "empresas", id);
    return await deleteDoc(ref);
};

// Registrar empresa con correo, contraseña y verificación
export const registrarEmpresaConAuth = async (datos) => {
    try {
        const cred = await createUserWithEmailAndPassword(secondaryAuth, datos.email, datos.password);
        await sendEmailVerification(cred.user);
        await setDoc(doc(db, "empresas", cred.user.uid), {
            nombre: datos.nombre || "",
            rut: datos.rut || "",
            direccion: datos.direccion || "",
            comuna: datos.comuna || "",
            telefono: datos.telefono || "",
            email: datos.email || "",
            tipo: "empresa"
        });
        await secondaryAuth.signOut();
        return cred;
    } catch (error) {
        console.error("Error registrando empresa:", error);
        throw error;
    }
};
