import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, getProductImage } from '../../utils/validators';

/**
 * Modal de Checkout y Creación de Orden.
 * Permite ingresar dirección de entrega, seleccionar método de pago
 * y confirmar la creación del pedido.
 */
export function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, checkoutItems, finalizeOrder } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Cali');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen || !checkoutItems || checkoutItems.length === 0) return null;

  const subtotal = checkoutItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shippingCost = subtotal >= 50000 ? 0 : 5000;
  const total = subtotal + shippingCost;

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      setIsCheckoutOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!address.trim() || address.trim().length < 5) {
      setError('Por favor ingresa una dirección de entrega válida (mínimo 5 caracteres).');
      return;
    }
    if (!city.trim()) {
      setError('La ciudad de destino es obligatoria.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setError('Por favor ingresa un número de teléfono de contacto válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      await finalizeOrder({
        shippingAddress: {
          address: address.trim(),
          city: city.trim(),
          phone: phone.trim(),
          notes: notes.trim()
        },
        paymentMethod
      });
    } catch (err) {
      setError(err.message || 'Error al procesar la orden de compra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isCheckoutOpen}
      title="🛍️ Finalizar Compra y Crear Orden"
      onClose={handleClose}
    >
      <div className="checkout-container">
        {error && (
          <div style={{ marginBottom: '1rem' }}>
            <Alert type="danger" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Resumen de Artículos a Comprar */}
        <div className="checkout-items-summary">
          <span className="checkout-section-title">
            📦 Resumen de Productos ({checkoutItems.reduce((acc, i) => acc + i.quantity, 0)})
          </span>
          <div className="checkout-items-list">
            {checkoutItems.map(({ product, quantity }) => (
              <div key={product.id} className="checkout-item-preview">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="checkout-item-img"
                />
                <div style={{ flex: 1 }}>
                  <p className="checkout-item-name">{product.name}</p>
                  <span className="checkout-item-qty">
                    Cant: {quantity} x {formatCurrency(product.price)}
                  </span>
                </div>
                <strong className="checkout-item-subtotal">
                  {formatCurrency(product.price * quantity)}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Datos del Comprador (Autocompletados) */}
          <div className="checkout-section">
            <span className="checkout-section-title">👤 Datos del Comprador</span>
            <div className="checkout-buyer-info">
              <div>
                <strong>Cliente:</strong> {user?.fullName || 'Comprador Registrado'}
              </div>
              <div>
                <strong>Email:</strong> {user?.email}
              </div>
            </div>
          </div>

          {/* Datos de Envío */}
          <div className="checkout-section">
            <span className="checkout-section-title">🚚 Dirección de Entrega</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Input
                label="Dirección de Envío"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej. Calle 15 # 85-30 Apto 402"
                required
              />
              <Input
                label="Ciudad"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Cali, Medellín, Bogotá..."
                required
              />
            </div>
            <Input
              label="Teléfono Móvil de Contacto"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej. 312 456 7890"
              required
            />
            <Input
              label="Notas Adicionales de Entrega (Opcional)"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instrucciones para la portería o mensajería..."
            />
          </div>

          {/* Método de Pago */}
          <div className="checkout-section">
            <span className="checkout-section-title">💳 Método de Pago</span>
            <div className="payment-methods-grid">
              <label className={`payment-method-card ${paymentMethod === 'credit_card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <strong>Tarjeta Débito / Crédito</strong>
                  <p>Visa, MasterCard, American Express</p>
                </div>
              </label>

              <label className={`payment-method-card ${paymentMethod === 'pse' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="pse"
                  checked={paymentMethod === 'pse'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <strong>PSE / Transferencia Bancaria</strong>
                  <p>Bancolombia, Nequi, Daviplata, BBVA</p>
                </div>
              </label>

              <label className={`payment-method-card ${paymentMethod === 'cash_on_delivery' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <strong>Pago Contra Entrega</strong>
                  <p>Paga en efectivo al recibir en tu puerta</p>
                </div>
              </label>
            </div>
          </div>

          {/* Totales y Costos */}
          <div className="checkout-totals-box">
            <div className="checkout-totals-row">
              <span>Subtotal productos:</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="checkout-totals-row">
              <span>Costo de envío:</span>
              <span>
                {shippingCost === 0 ? (
                  <span className="badge badge-success">¡ENVÍO GRATIS!</span>
                ) : (
                  formatCurrency(shippingCost)
                )}
              </span>
            </div>
            <div className="checkout-totals-row checkout-total-final">
              <span>Total a Pagar:</span>
              <span className="checkout-price-highlight">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
              Volver a la Tienda
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando Orden...' : '✅ Confirmar y Crear Orden'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
