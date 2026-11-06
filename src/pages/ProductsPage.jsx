import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../context/AuthContext';
import { ProductList } from '../components/products/ProductList';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

/**
 * Vista de administración de productos con Control de Acceso basado en Roles (RBAC).
 * Permite lectura pública y restringe mutaciones exclusivamente a ROLE_ADMIN.
 */
export function ProductsPage() {
  const { products, isLoading, error, reload, addProduct, updateProduct, removeProduct } = useProducts();
  const { isAdmin, setIsLoginModalOpen } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleOpenCreate = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async (productData) => {
    if (editingProduct) {
      const res = await updateProduct(editingProduct.id, productData);
      if (res.success) {
        setNotification({ type: 'success', message: 'Producto actualizado en la base de datos.' });
      }
      return res;
    } else {
      const res = await addProduct(productData);
      if (res.success) {
        setNotification({ type: 'success', message: 'Producto registrado exitosamente en el backend.' });
      }
      return res;
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }

    const confirmed = window.confirm('¿Está seguro de desactivar lógicamente este producto?');
    if (!confirmed) return;

    const res = await removeProduct(id);
    if (res.success) {
      setNotification({ type: 'info', message: 'Producto desactivado (borrado lógico aplicado en backend).' });
    } else {
      setNotification({ type: 'danger', message: res.error || 'Error al desactivar el producto.' });
    }
  };

  return (
    <section aria-labelledby="products-heading">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 id="products-heading" style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
            Gestión de Inventario y Productos
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
            Control de catálogo conectado a <code>/api/products</code> (Spring Boot 3)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={reload} disabled={isLoading}>
            🔄 Recargar
          </Button>
          {isAdmin ? (
            <Button variant="primary" onClick={handleOpenCreate}>
              + Nuevo Producto
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsLoginModalOpen(true)}>
              🔒 Desbloquear Edición (Admin)
            </Button>
          )}
        </div>
      </div>

      {!isAdmin && (
        <div style={{ marginBottom: '1.25rem' }}>
          <Alert
            type="info"
            message="Modo de sólo lectura activo. Para crear, actualizar o desactivar productos se requiere sesión con rol ROLE_ADMIN (admin@ecommerce.com / admin123)."
          />
        </div>
      )}

      {notification && (
        <div style={{ marginBottom: '1.25rem' }}>
          <Alert
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      {isLoading && <LoadingSpinner message="Consultando catálogo en http://localhost:8081/api/products..." />}

      {error && !isLoading && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Alert type="danger" message={error} />
        </div>
      )}

      {!isLoading && !error && (
        <ProductList
          products={products}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
      )}

      {isAdmin && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          initialData={editingProduct}
        />
      )}
    </section>
  );
}
