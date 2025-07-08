import { addProducto, updateProducto } from '../../services/productoService';
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { useEffect } from "react";

export default function ModalProductos({
    show,
    setShow,
    userData,
    handleRefresh,
    formData,
    setFormData
}) {
    useEffect(() => {
        if (!formData.estado) {
            setFormData(f => ({ ...f, estado: "activo" }));
        }
    }, [formData, setFormData]);

    const guardarProducto = async (e) => {
        e.preventDefault();
        if (formData.id) {
            await updateProducto(formData.id, formData);
            Swal.fire("Actualizado correctamente", "", "success");
        } else {
            await addProducto({ ...formData, empresaId: userData.uid });
            Swal.fire("Agregado correctamente", "", "success");
        }
        handleRefresh();
        setShow(false);
    };

    // Advertencia de vencimiento
    const diasParaVencer = formData.vencimiento
        ? Math.ceil((new Date(formData.vencimiento) - new Date()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            centered
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header>
                <Modal.Title>
                    {formData.id ? "Editar" : "Agregar"} Producto
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={guardarProducto}>
                <Modal.Body closeButton>
                    <input
                        className="form-control mb-2"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={(e) =>
                            setFormData({ ...formData, nombre: e.target.value })
                        }
                        required
                    />
                    <textarea
                        className="form-control mb-2"
                        placeholder="Descripción"
                        value={formData.descripcion}
                        onChange={(e) =>
                            setFormData({ ...formData, descripcion: e.target.value })
                        }
                        required
                    ></textarea>
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Cantidad"
                        value={formData.cantidad || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, cantidad: e.target.value })
                        }
                        min={0}
                        required
                    />
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Precio"
                        value={formData.precio}
                        onChange={(e) =>
                            setFormData({ ...formData, precio: e.target.value })
                        }
                        min={0}
                        required
                    />
                    <input
                        type="date"
                        className="form-control mb-2"
                        value={formData.vencimiento}
                        onChange={(e) =>
                            setFormData({ ...formData, vencimiento: e.target.value })
                        }
                        required
                    />
                    <select
                        className="form-control mb-2"
                        value={formData.estado || "activo"}
                        onChange={(e) =>
                            setFormData({ ...formData, estado: e.target.value })
                        }
                    >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                    {diasParaVencer !== null && diasParaVencer <= 3 && diasParaVencer >= 0 && (
                        <div className="alert alert-warning">
                            ¡Este producto vence en {diasParaVencer} día(s)!
                        </div>
                    )}
                    {formData.precio === 0 && (
                        <div className="alert alert-info">
                            Este producto es gratuito.
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShow(false)}
                    >
                        Cerrar
                    </button>
                    <button type="submit" className="btn btn-success">
                        Guardar
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}