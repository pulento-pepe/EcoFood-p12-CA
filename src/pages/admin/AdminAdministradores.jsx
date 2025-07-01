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

  const fetchAdmins = async () => {
    const q = query(collection(db, 'usuarios'), where('tipo', '==', 'admin'));
    const snapshot = await getDocs(q);
    const adminsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAdmins(adminsList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email === ADMIN_PRINCIPAL_EMAIL && admins.some(a => a.email === ADMIN_PRINCIPAL_EMAIL && !editId)) {
      Swal.fire('Error', 'Ya existe un administrador principal.', 'error');
      return;
    }
    if (editId) {
      await updateDoc(doc(db, 'usuarios', editId), formData);
    } else {
      await addDoc(collection(db, 'usuarios'), { ...formData, tipo: 'admin', isPrincipal: false });
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

  const handleSetPrincipal = async (id) => {
    const currentPrincipal = admins.find(admin => admin.isPrincipal);
    if (currentPrincipal) {
      Swal.fire('Error', 'Ya existe un administrador principal.', 'error');
      return;
    }
    await updateDoc(doc(db, 'usuarios', id), { isPrincipal: true });
    fetchAdmins();
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div>
      <h2>Gestión de Administradores</h2>
      <form onSubmit={handleSubmit}>
        <FormInput label="Nombre" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value})} required />
        <FormInput label="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
        <FormInput label="Contraseña" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required={!editId} />
        <button type="submit">{editId ? 'Actualizar' : 'Crear'} Administrador</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Principal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.id}>
              <td>{admin.nombre}</td>
              <td>{admin.email}</td>
              <td>
                {admin.isPrincipal ? (
                  <span>Principal</span>
                ) : (
                  <button onClick={() => handleSetPrincipal(admin.id)} disabled={admins.some(a => a.isPrincipal)}>
                    Seleccionar como Principal
                  </button>
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(admin)} disabled={admin.isPrincipal}>Editar</button>
                <button onClick={() => handleDelete(admin.id, admin.email)} disabled={admin.isPrincipal}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAdministradores;