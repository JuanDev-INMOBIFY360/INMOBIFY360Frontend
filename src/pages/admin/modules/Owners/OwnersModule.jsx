import { useState, useEffect } from "react";
import {
  getOwners,
  createOwner,
  updateOwner,
  deleteOwner,
} from "../../../../services/OwnersService";
import { useModal } from "../../../../hooks/useModal";
import TablesModule from "../../../../components/TablesModule/";
import OwnersForm from "./OwnersForm";
import { ownersConfig } from "./config";
import ErrorMessage from "../../../../components/ErrorMessage";
import LoadingSpinner from "../../../../components/Loading";
import "./styles/owners.css";

export default function OwnersModule() {
  const { isOpen, onOpen, onClose } = useModal();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getOwners();
      setItems(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Error cargando propietarios");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
    setEditingItem(null);
  };

  const handleSave = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingItem) {
        await updateOwner(editingItem.id, formData);
      } else {
        await createOwner(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || "Error guardando propietario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("¿Está seguro de que desea eliminar este propietario?")
    ) {
      return;
    }
    try {
      await deleteOwner(id);
      await loadData();
    } catch (err) {
      setError(err.message || "Error eliminando propietario");
    }
  };

  return (
    <section className="owners-module">
      <div className="owners-header">
        <h2>{ownersConfig.moduleNamePlural}</h2>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          + Crear {ownersConfig.moduleName}
        </button>
      </div>

      {error && <ErrorMessage message={error} />}
      {loading && !items.length && <LoadingSpinner />}

      {!loading && (
        <TablesModule
          data={items}
          columns={ownersConfig.columns}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage={ownersConfig.messages.empty}
        />
      )}

      {isOpen && (
        <OwnersForm
          item={editingItem}
          onSave={handleSave}
          onClose={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      )}
    </section>
  );
}
