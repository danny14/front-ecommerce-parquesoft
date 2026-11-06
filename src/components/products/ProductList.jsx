import React from 'react';
import { formatCurrency } from '../../utils/validators';
import { Button } from '../common/Button';

/**
 * Componente presentacional para la lista de productos con soporte para RBAC.
 * 
 * @param {{
 *   products: Array<{ id: number|string, name: string, sku: string, price: number, stock: number, active: boolean }>,
 *   onEdit: (product: object) => void,
 *   onDelete: (id: number|string) => void,
 *   isAdmin?: boolean
 * }} props
 */
export function ProductList({ products, onEdit, onDelete, isAdmin = false }) {
  if (!products || products.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
          📦 No hay productos registrados en la base de datos.
        </p>
      </div>
    );
  }

  return (
    <div className="card table-responsive">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>SKU</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            {isAdmin && <th style={{ textAlign: 'right' }}>Acciones (Admin)</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isLowStock = product.stock <= 5;
            return (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <strong>{product.name}</strong>
                </td>
                <td>
                  <code>{product.sku}</code>
                </td>
                <td>{formatCurrency(product.price)}</td>
                <td>
                  <span style={{ color: isLowStock ? 'var(--danger)' : 'inherit', fontWeight: isLowStock ? 600 : 400 }}>
                    {product.stock} unid.
                  </span>
                  {isLowStock && (
                    <span style={{ fontSize: '0.75rem', marginLeft: '0.4rem', color: 'var(--danger)' }}>
                      (Bajo)
                    </span>
                  )}
                </td>
                <td>
                  <span className={`badge ${product.active ? 'badge-success' : 'badge-danger'}`}>
                    {product.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                {isAdmin && (
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <Button
                        variant="secondary"
                        className="btn-sm"
                        onClick={() => onEdit(product)}
                        disabled={!product.active}
                      >
                        Editar
                      </Button>
                      {product.active && (
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => onDelete(product.id)}
                        >
                          Desactivar
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
