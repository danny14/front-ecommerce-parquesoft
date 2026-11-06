import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { validateProductData } from '../../utils/validators';

const INITIAL_FORM_STATE = {
  name: '',
  sku: '',
  price: '',
  stock: ''
};

/**
 * Modal controlado para creación y edición de productos.
 * 
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onSubmit: (productData: object) => Promise<{ success: boolean, error?: string }>,
 *   initialData?: object | null
 * }} props
 */
export function ProductFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialData && initialData.id);

  // Sincronizar datos iniciales al abrir para edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        sku: initialData.sku || '',
        price: initialData.price !== undefined ? String(initialData.price) : '',
        stock: initialData.stock !== undefined ? String(initialData.stock) : ''
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
    setFieldErrors({});
    setServerError(null);
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpiar error del campo modificado
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    // Validación defensiva en cliente
    const validation = validateProductData(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        sku: formData.sku.trim().toUpperCase(),
        price: Number(formData.price),
        stock: parseInt(formData.stock, 10)
      };

      const result = await onSubmit(payload);
      if (result.success) {
        onClose();
      } else {
        setServerError(result.error || 'Error al guardar el producto');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={isEditMode ? 'Editar Producto' : 'Crear Nuevo Producto'}
      onClose={onClose}
    >
      {serverError && (
        <div style={{ marginBottom: '1rem' }}>
          <Alert type="danger" message={serverError} onClose={() => setServerError(null)} />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Nombre del Producto"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej. Laptop Gamer Pro"
          required
          error={fieldErrors.name}
        />

        <Input
          label="Código SKU"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          placeholder="Ej. SKU-9901"
          required
          error={fieldErrors.sku}
        />

        <Input
          label="Precio (US$)"
          name="price"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.price}
          onChange={handleChange}
          placeholder="100.00"
          required
          error={fieldErrors.price}
        />

        <Input
          label="Stock Inicial"
          name="stock"
          type="number"
          step="1"
          min="0"
          value={formData.stock}
          onChange={handleChange}
          placeholder="0"
          required
          error={fieldErrors.stock}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar Producto' : 'Guardar Producto')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
