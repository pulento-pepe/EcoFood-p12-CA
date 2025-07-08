import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const getEmpresaById = async (uid) => {
    const ref = doc(db, "empresas", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : {};
};

export const updateEmpresa = async (uid, data) => {
    const ref = doc(db, "empresas", uid);
    await updateDoc(ref, data);
};