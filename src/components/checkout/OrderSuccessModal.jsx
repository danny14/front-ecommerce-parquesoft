import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/validators';
import { useCart } from '../../context/CartContext';

/**
 * Modal de Confirmación y Recibo de Orden Creada.
 * Ofrece retroalimentación visual inmediata con el número de pedido y detalles del despacho.
 */
export function OrderSuccessModal() {
  const { isSuccessOpen, setIsSuccessOpen, lastCreatedOrder, setIsHistoryOpen } = useCart();

  if (!isSuccessOpen || !lastCreatedOrder) return null;

  const handleGoToHistory = () => {
    setIsSuccessOpen(false);
    setIsHistoryOpen(true);
  };

  return (
    <Modal
      isOpen={isSuccessOpen}
      title="🎉 ¡Orden Creada Exitosamente!"
      onClose={() => setIsSuccessOpen(false)}
    >
      <div className="order-success-content">
        <div className="order-success-badge">
          <span role="img" aria-label="Éxito" style={{ fontSize: '3rem' }}>
            ✅
          </span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0.5rem 0 0.25rem' }}>
            ¡Gracias por tu compra!
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Hemos recibido y registrado tu pedido satisfactoriamente.
          </p>
        </div>

        {/* Ficha del Pedido */}
        <div className="order-ticket card">
          <div className="order-ticket-header">
            <div>
              <span className="order-ticket-label">NÚMERO DE ORDEN</span>
              <p className="order-ticket-id">{lastCreatedOrder.orderNumber}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="order-ticket-label">FECHA Y HORA</span>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>
                {new Date(lastCreatedOrder.createdAt).toLocaleString('es-CO')}
              </p>
            </div>
          </div>

          <div className="order-ticket-body">
            <div className="order-ticket-row">
              <span>Cliente:</span>
              <strong>{lastCreatedOrder.buyer?.fullName} ({lastCreatedOrder.buyer?.email})</strong>
            </div>
            <div className="order-ticket-row">
              <span>Dirección de Entrega:</span>
              <strong>
                {lastCreatedOrder.shippingAddress?.address}, {lastCreatedOrder.shippingAddress?.city}
              </strong>
            </div>
            <div className="order-ticket-row">
              <span>Teléfono de Contacto:</span>
              <strong>{lastCreatedOrder.shippingAddress?.phone}</strong>
            </div>
            <div className="order-ticket-row">
              <span>Método de Pago:</span>
              <span className="badge badge-primary">
                {lastCreatedOrder.paymentMethod === 'credit_card'
                  ? 'Tarjeta de Crédito'
                  : lastCreatedOrder.paymentMethod === 'pse'
                  ? 'PSE / Transferencia'
                  : 'Pago Contra Entrega'}
              </span>
            </div>
            <div className="order-ticket-row">
              <span>Estado del Pedido:</span>
              <span className="badge badge-success">
                {lastCreatedOrder.status}
              </span>
            </div>
          </div>

          <div className="order-ticket-items">
            <span className="order-ticket-label">ARTÍCULOS INCLUIDOS:</span>
            {lastCreatedOrder.items?.map((item, idx) => (
              <div key={idx} className="order-ticket-item-row">
                <span>
                  {item.quantity}x {item.name} <code>({item.sku})</code>
                </span>
                <strong>{formatCurrency(item.subtotal || item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <div className="order-ticket-total">
            <span>Total Pagado:</span>
            <span className="order-ticket-total-val">
              {formatCurrency(lastCreatedOrder.total)}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={handleGoToHistory}>
            📜 Ver Mis Pedidos
          </Button>
          <Button variant="primary" onClick={() => setIsSuccessOpen(false)}>
            🛍️ Seguir Comprando
          </Button>
        </div>
      </div>
    </Modal>
  );
}
