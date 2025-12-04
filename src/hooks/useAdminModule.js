/**
 * useAdminModule - Custom hook for CRUD operations in admin modules
 * 
 * Eliminates code duplication across admin pages
 * Manages: loading, error, form state, CRUD operations
 * 
 * Usage:
 * const {
 *   items, loading, error, isModalOpen, editingId, formData, isSubmitting,
 *   openModal, closeModal, updateFormData, handleSubmit, handleDelete, reload
 * } = useAdminModule(usersService, initialFormState);
 */

import { useState, useEffect, useCallback } from 'react';

export const useAdminModule = (
  service,
  initialFormData = {},
  onLoadExtra = null // Optional callback to load related data (e.g., roles)
) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  // Load items from service
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.getAll();
      setItems(data || []);
      
      // Call optional extra loader (for related data like roles)
      if (onLoadExtra) {
        await onLoadExtra();
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [service, onLoadExtra]);

  // Initial load
  useEffect(() => {
    reload();
  }, [reload]);

  // Open modal for create or edit
  const openModal = useCallback((item = null) => {
    if (item) {
      setEditingId(item.id);
      // Populate form with item data (excluding sensitive fields)
      const { password, ...safeData } = item;
      setFormData({
        ...initialFormData,
        ...safeData,
      });
    } else {
      setEditingId(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  }, [initialFormData]);

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormData);
  }, [initialFormData]);

  // Update form field
  const updateFormData = useCallback((key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Handle submit (create or update)
  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault?.();
    
    if (isSubmitting) return; // Prevent double submit
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (editingId) {
        await service.update(editingId, formData);
      } else {
        await service.create(formData);
      }
      
      await reload();
      closeModal();
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [editingId, formData, service, reload, closeModal, isSubmitting]);

  // Handle delete
  const handleDelete = useCallback(async (id, confirmMessage = '¿Estás seguro?') => {
    if (!window.confirm(confirmMessage)) return;
    
    setError(null);
    try {
      await service.delete(id);
      await reload();
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err);
    }
  }, [service, reload]);

  return {
    // State
    items,
    loading,
    error,
    isModalOpen,
    editingId,
    formData,
    isSubmitting,
    
    // Actions
    openModal,
    closeModal,
    updateFormData,
    handleSubmit,
    handleDelete,
    reload,
  };
};
