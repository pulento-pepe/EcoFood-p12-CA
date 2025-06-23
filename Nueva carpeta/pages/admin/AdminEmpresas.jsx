import { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';

const AdminEmpresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        direccion: '',
        comuna: '',
        email: '',
        telefono: ''
    });
    const [editId, setEditId] = useState(null);

    const fetchEmpresas = async () => {
        const snapshot = await getDocs(collection(db, 'empresas'));
        setEmpresas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await updateDoc(doc(db, 'empresas', editId), formData);
        } else {
            await addDoc(collection(db, 'empresas'), formData);
        }
        setFormData({
            nombre: '',
            rut: '',
            direccion: '',
            comuna: '',
            email: '',
            telefono: ''
        });
        setEditId(null);
        fetchEmpresas();
    };

    const handleEdit = (empresa) => {
        setFormData({ ...empresa });
        setEditId(empresa.id);
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'empresas', id));
        fetchEmpresas();
    };

    useEffect(() => {
        fetchEmpresas();
    }, []);

    return (
        <div>
            <h2>Gestión de Empresas</h2>
            <form onSubmit={handleSubmit}>
                {['nombre', 'rut', 'direccion', 'comuna', 'email', 'telefono'].map((field) => (
                    <input
                        key={field}
                        placeholder={field}
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        required
                    />
                ))}
                <button type="submit">{editId ? 'Actualizar' : 'Crear'} Empresa</button>
            </form>

            <ul>
                {empresas.map((emp) => (
                    <li key={emp.id}>
                        {emp.nombre} ({emp.rut})
                        <button onClick={() => handleEdit(emp)}>Editar</button>
                        <button onClick={() => handleDelete(emp.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminEmpresas;
