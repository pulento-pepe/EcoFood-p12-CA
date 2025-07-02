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

  // Validaciones
  const NOMBRE_MIN = 3, NOMBRE_MAX = 30;
  const EMAIL_MIN = 6, EMAIL_MAX = 50;
  const PASS_MIN = 6, PASS_MAX = 30;

  const validarNombre = (nombre) => {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return (
      regex.test(nombre) &&
      nombre.length >= NOMBRE_MIN &&
      nombre.length <= NOMBRE_MAX
    );
  };

  const validarEmail = (email) => {
    return email.length >= EMAIL_MIN && email.length <= EMAIL_MAX;
  };

  const validarPassword = (password) => {
    return password.length >= PASS_MIN && password.length <= PASS_MAX;
  };

  return (
    <div>
      <h2>Gestión de Administradores</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!validarNombre(formData.nombre)) {
            Swal.fire(
              'Error',
              `El nombre debe tener solo letras y entre ${NOMBRE_MIN} y ${NOMBRE_MAX} caracteres.`,
              'error'
            );
            return;
          }
          if (!validarEmail(formData.email)) {
            Swal.fire(
              'Error',
              `El email debe tener entre ${EMAIL_MIN} y ${EMAIL_MAX} caracteres.`,
              'error'
            );
            return;
          }
          if (!editId && !validarPassword(formData.password)) {
            Swal.fire(
              'Error',
              `La contraseña debe tener entre ${PASS_MIN} y ${PASS_MAX} caracteres.`,
              'error'
            );
            return;
          }
          handleSubmit(e);
        }}
      >
        <FormInput
          label="Nombre"
          value={formData.nombre}
          onChange={e => {
            // Solo permitir letras y espacios en tiempo real
            const val = e.target.value;
            if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(val) && val.length <= NOMBRE_MAX) {
              setFormData({ ...formData, nombre: val });
            }
          }}
          required
          minLength={NOMBRE_MIN}
          maxLength={NOMBRE_MAX}
        />
        <FormInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={e => {
            const val = e.target.value;
            if (val.length <= EMAIL_MAX) {
              setFormData({ ...formData, email: val });
            }
          }}
          required
          minLength={EMAIL_MIN}
          maxLength={EMAIL_MAX}
        />
        <FormInput
          label="Contraseña"
          type="password"
          value={formData.password}
          onChange={e => {
            const val = e.target.value;
            if (val.length <= PASS_MAX) {
              setFormData({ ...formData, password: val });
            }
          }}
          required={!editId}
          minLength={PASS_MIN}
          maxLength={PASS_MAX}
        />
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
                <button
                  onClick={() => handleEdit(admin)}
                  disabled={admin.isPrincipal}
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    marginRight: '8px',
                    cursor: admin.isPrincipal ? 'not-allowed' : 'pointer'
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(admin.id, admin.email)}
                  disabled={admin.isPrincipal}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: admin.isPrincipal ? 'not-allowed' : 'pointer'
                  }}
                >
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

export default AdminAdministradores;