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
import FormInput from '../../components/FormInput';

const AdminEmpresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        direccion: '',
        comuna: '',
        email: '',
        telefono: '',
        productos: []
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
            telefono: '',
            productos: []
        });
        setEditId(null);
        fetchEmpresas();
    };

    const handleEdit = (empresa) => {
        setFormData({ ...empresa, productos: empresa.productos || [] });
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
                <FormInput label="Nombre" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
                <FormInput label="Rut" value={formData.rut} onChange={e => setFormData({ ...formData, rut: e.target.value })} required />
                <FormInput label="Dirección" value={formData.direccion} onChange={e => setFormData({ ...formData, direccion: e.target.value })} required />
                <FormInput label="Comuna" value={formData.comuna} onChange={e => setFormData({ ...formData, comuna: e.target.value })} required />
                <FormInput label="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                <FormInput label="Teléfono" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} required />
                <button type="submit">{editId ? 'Actualizar' : 'Crear'} Empresa</button>
            </form>

            <ul>
                {empresas.map((emp) => (
                    <li key={emp.id}>
                        {emp.nombre} ({emp.rut})
                        <button onClick={() => handleEdit(emp)}>Editar</button>
                        <button onClick={() => handleDelete(emp.id)}>Eliminar</button>
                        <div>
                            <strong>Productos asociados:</strong>
                            <ul>
                                {(emp.productos || []).length === 0 ? (
                                    <li>No hay productos asociados</li>
                                ) : (
                                    emp.productos.map((prod, idx) => <li key={idx}>{prod}</li>)
                                )}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminEmpresas;
