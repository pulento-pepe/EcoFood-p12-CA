import { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import Swal from 'sweetalert2';
import FormInput from '../../components/FormInput';

const ADMIN_PRINCIPAL_EMAIL = 'admin@ecofood.cl'; // Cambia esto por el email real del admin principal

const AdminAdministradores = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [editId, setEditId] = useState(null);
  const [principalCount, setPrincipalCount] = useState(0);

  const fetchAdmins = async () => {
    const q = query(collection(db, 'usuarios'), where('tipo', '==', 'admin'));
    const snapshot = await getDocs(q);
    const adminsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAdmins(adminsList);
    setPrincipalCount(adminsList.filter(a => a.email === ADMIN_PRINCIPAL_EMAIL).length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email === ADMIN_PRINCIPAL_EMAIL && principalCount > 0 && !editId) {
      Swal.fire('Error', 'Ya existe un administrador principal.', 'error');
      return;
    }
    if (editId) {
      await updateDoc(doc(db, 'usuarios', editId), formData);
    } else {
      await addDoc(collection(db, 'usuarios'), { ...formData, tipo: 'admin' });
    }
    setFormData({ nombre: '', email: '', password: '' });
    setEditId(null);
    fetchAdmins();
  };

  const handleEdit = (admin) => {
    setFormData({ nombre: admin.nombre, email: admin.email, password: '' });
    setEditId(admin.id);
  };

  const handleDelete = async (id, email) => {
    if (email === ADMIN_PRINCIPAL_EMAIL) {
      if (principalCount <= 1) {
        Swal.fire('Error', 'Debe existir al menos un administrador principal.', 'error');
        return;
      }
      Swal.fire('Error', 'No puedes eliminar el administrador principal.', 'error');
      return;
    }
    const result = await Swal.fire({
      title: '¿Eliminar administrador?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
    });
    if (result.isConfirmed) {
      await deleteDoc(doc(db, 'usuarios', id));
      fetchAdmins();
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div>
      <h2>Gestión de Administradores</h2>
      <form onSubmit={handleSubmit}>
        <FormInput label="Nombre" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
        <FormInput label="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
        <FormInput label="Contraseña" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required={!editId} />
        <button type="submit">{editId ? 'Actualizar' : 'Crear'} Administrador</button>
      </form>
      <ul>
        {admins.map(admin => (
          <li key={admin.id}>
            {admin.nombre} ({admin.email})
            <button onClick={() => handleEdit(admin)}>Editar</button>
            <button onClick={() => handleDelete(admin.id, admin.email)} disabled={admin.email === ADMIN_PRINCIPAL_EMAIL}>
              Eliminar
            </button>
            {admin.email === ADMIN_PRINCIPAL_EMAIL && <span> (Principal)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminAdministradores; 