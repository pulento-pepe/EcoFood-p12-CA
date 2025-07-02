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
        telefono: '',
        productos: []
    });
    const [editId, setEditId] = useState(null);

    const fetchEmpresas = async () => {
        const snapshot = await getDocs(collection(db, 'empresas'));
        setEmpresas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const validarFormulario = () => {
        const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        const soloNumeros = /^[0-9]{9}$/;

        if (!formData.nombre.match(soloLetras) || formData.nombre.length < 3 || formData.nombre.length > 30) {
            alert("El nombre debe tener entre 3 y 30 letras.");
            return false;
        }
        if (!formData.comuna.match(soloLetras) || formData.comuna.length < 3 || formData.comuna.length > 30) {
            alert("La comuna debe tener entre 3 y 30 letras.");
            return false;
        }
        if (!soloNumeros.test(formData.telefono)) {
            alert("El teléfono debe contener exactamente 9 números.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        if (editId) {
            const { email, ...rest } = formData; // evitar edición de email
            await updateDoc(doc(db, 'empresas', editId), rest);
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
        if (confirm("¿Estás seguro de eliminar esta empresa?")) {
            await deleteDoc(doc(db, 'empresas', id));
            fetchEmpresas();
        }
    };

    useEffect(() => {
        fetchEmpresas();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="text-center">Gestión de Empresas</h2>

            <form onSubmit={handleSubmit} className="mb-4">
                <input className="form-control mb-2" placeholder="Nombre"
                    value={formData.nombre}
                    onChange={e => {
                        const value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                        setFormData({ ...formData, nombre: value });
                    }}
                    required minLength={3} maxLength={30} />

                <input className="form-control mb-2" placeholder="Rut"
                    value={formData.rut}
                    onChange={e => setFormData({ ...formData, rut: e.target.value })}
                    required minLength={8} maxLength={12} />

                <input className="form-control mb-2" placeholder="Dirección"
                    value={formData.direccion}
                    onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                    required minLength={5} maxLength={50} />

                <input className="form-control mb-2" placeholder="Comuna"
                    value={formData.comuna}
                    onChange={e => {
                        const value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                        setFormData({ ...formData, comuna: value });
                    }}
                    required minLength={3} maxLength={30} />

                <input className="form-control mb-2" placeholder="Email" type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required minLength={5} maxLength={40} disabled={!!editId} />

                <input className="form-control mb-2" placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                    required minLength={9} maxLength={9} />

                <button type="submit" className="btn btn-success">
                    {editId ? 'Actualizar' : 'Crear'} Empresa
                </button>
            </form>

            <table className="table table-bordered text-center">
                <thead className="table-light">
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Ubicación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empresas.map((emp) => (
                        <tr key={emp.id}>
                            <td>{emp.nombre}</td>
                            <td>{emp.email}</td>
                            <td>{emp.comuna}, {emp.direccion}</td>
                            <td>
                                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(emp)}>
                                    Editar
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminEmpresas;
