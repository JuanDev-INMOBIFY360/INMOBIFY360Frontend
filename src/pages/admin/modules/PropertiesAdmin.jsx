import React, { useEffect, useState } from 'react';
import { getProperties, createProperty, updateProperty, deleteProperty } from '../../../services/propertyService';
import { getCountries } from '../../../services/CountriesService';
import { getDepartments } from '../../../services/DepartamentsService';
import { getCities } from '../../../services/CitiesService';
import { getNeighborhoods } from '../../../services/NeighborhoodsService';
import { getTypes } from '../../../services/TypesService';
import { getOwners } from '../../../services/OwnersService';
import Modal from '../../../components/Modal';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function PropertiesAdmin() {
  const [items, setItems] = useState([]);
  const [countries, setCountries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [types, setTypes] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '', descripcion: '', precio: '', area: '', habitaciones: '', banos: '', parqueaderos: '',
    direccion: '', ownerId: '', countryId: '', departmentId: '', cityId: '', neighborhoodId: '', typePropertyId: ''
  });

  const load = async () => {
    setLoading(true);
    try {
      const [propsData, countriesData, deptsData, citiesData, neighData, typesData, ownersData] = await Promise.all([
        getProperties(), getCountries(), getDepartments(), getCities(), getNeighborhoods(), getTypes(), getOwners()
      ]);
      setItems(propsData || []);
      setCountries(countriesData || []);
      setDepartments(deptsData || []);
      setCities(citiesData || []);
      setNeighborhoods(neighData || []);
      setTypes(typesData || []);
      setOwners(ownersData || []);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onOpenModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        titulo: item.titulo || '', descripcion: item.descripcion || '', precio: item.precio || '', area: item.area || '',
        habitaciones: item.habitaciones || '', banos: item.banos || '', parqueaderos: item.parqueaderos || '',
        direccion: item.direccion || '', ownerId: item.ownerId || '', countryId: item.countryId || '',
        departmentId: item.departmentId || '', cityId: item.cityId || '', neighborhoodId: item.neighborhoodId || '',
        typePropertyId: item.typePropertyId || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        titulo: '', descripcion: '', precio: '', area: '', habitaciones: '', banos: '', parqueaderos: '',
        direccion: '', ownerId: '', countryId: '', departmentId: '', cityId: '', neighborhoodId: '', typePropertyId: ''
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, precio: parseFloat(formData.precio), area: parseFloat(formData.area) };
      if (editingId) {
        await updateProperty(editingId, payload);
      } else {
        await createProperty(payload);
      }
      await load();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error submitting property', err);
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('¿Eliminar propiedad?')) return;
    try {
      await deleteProperty(id);
      await load();
    } catch (err) {
      console.error('Error deleting property', err);
      setError(err);
    }
  };

  return (
    <section className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Propiedades</h2>
        <button className="btn" onClick={() => onOpenModal()}>
          <Plus size={16} style={{ marginRight: 6 }} /> Crear Propiedad
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-danger">Error al cargar propiedades</p>}
      {!loading && !error && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Precio</th>
              <th>Propietario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length ? (
              items.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{it.titulo || '-'}</td>
                  <td>${it.precio || '-'}</td>
                  <td>{owners.find(o => o.id === it.ownerId)?.name || '-'}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm" onClick={() => onOpenModal(it)}><Edit size={14} /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(it.id)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No hay propiedades</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <Modal isOpen={isModalOpen} title={editingId ? 'Editar Propiedad' : 'Crear Propiedad'} onClose={() => setIsModalOpen(false)} onSubmit={onSubmit} isLoading={isSubmitting} submitText="Guardar">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label>Título</label>
            <input value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Precio</label>
            <input type="number" value={formData.precio} onChange={(e) => setFormData({...formData, precio: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Área (m²)</label>
            <input type="number" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Habitaciones</label>
            <input type="number" value={formData.habitaciones} onChange={(e) => setFormData({...formData, habitaciones: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Baños</label>
            <input type="number" value={formData.banos} onChange={(e) => setFormData({...formData, banos: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Parqueaderos</label>
            <input type="number" value={formData.parqueaderos} onChange={(e) => setFormData({...formData, parqueaderos: e.target.value})} />
          </div>
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} rows="3"></textarea>
        </div>
        <div className="form-group">
          <label>Dirección</label>
          <input value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label>Propietario</label>
            <select value={formData.ownerId} onChange={(e) => setFormData({...formData, ownerId: e.target.value})} required>
              <option value="">Seleccionar</option>
              {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <select value={formData.typePropertyId} onChange={(e) => setFormData({...formData, typePropertyId: e.target.value})} required>
              <option value="">Seleccionar</option>
              {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>País</label>
            <select value={formData.countryId} onChange={(e) => setFormData({...formData, countryId: e.target.value})} required>
              <option value="">Seleccionar</option>
              {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Departamento</label>
            <select value={formData.departmentId} onChange={(e) => setFormData({...formData, departmentId: e.target.value})} required>
              <option value="">Seleccionar</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Ciudad</label>
            <select value={formData.cityId} onChange={(e) => setFormData({...formData, cityId: e.target.value})} required>
              <option value="">Seleccionar</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Barrio</label>
            <select value={formData.neighborhoodId} onChange={(e) => setFormData({...formData, neighborhoodId: e.target.value})} required>
              <option value="">Seleccionar</option>
              {neighborhoods.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </section>
  );
}
