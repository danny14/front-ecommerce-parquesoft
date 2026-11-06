import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency, getProductImage } from '../../utils/validators';
import { Button } from '../common/Button';

/**
 * Cajón Lateral del Carrito de Compras (Cart Drawer).
 * Presenta barra de progreso para envío gratis, ajuste de unidades,
 * vaciado de carrito y botón directo de "Proceder al Pago".
 */
export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalItems,
    proceedToCheckout
  } = useCart();

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 50000;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckoutClick = () => {
    proceedToCheckout();
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => setIsCartOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <div
        className="modal-content cart-drawer-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span role="img" aria-label="Carrito" style={{ fontSize: '1.4rem' }}>🛒</span>
            <h3 id="cart-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
              Cesta de Compras ({totalItems})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Cerrar carrito"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            &times;
          </button>
        </div>

        {/* Barra de Progreso de Envío Gratis */}
        <div className="cart-shipping-progress-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
            <span>🚚 {isFreeShipping ? '¡Genial! Tienes Envío Gratis' : `Agrega ${formatCurrency(amountToFreeShipping)} para Envío Gratis`}</span>
            <strong>{Math.round(freeShippingProgress)}%</strong>
          </div>
          <div className="cart-shipping-bar">
            <div
              className={`cart-shipping-bar-fill ${isFreeShipping ? 'complete' : ''}`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Lista de Artículos */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
              <span role="img" aria-label="Carrito vacío" style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>
                🛍️
              </span>
              <p style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Tu cesta de compras está vacía
              </p>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Explora el catálogo y añade tus productos de tecnología favoritos.
              </p>
              <Button variant="primary" onClick={() => setIsCartOpen(false)}>
                Ver Catálogo de Tienda
              </Button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="cart-item-row">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="cart-item-thumbnail"
                  />
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{product.name}</h4>
                    <span className="cart-item-sku">SKU: {product.sku}</span>
                    <span className="cart-item-price">
                      {formatCurrency(product.price)} c/u
                    </span>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-control quantity-control-sm">
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="Restar 1"
                      >
                        -
                      </button>
                      <span className="quantity-display">{quantity}</span>
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        aria-label="Sumar 1"
                      >
                        +
                      </button>
                    </div>

                    <span className="cart-item-subtotal">
                      {formatCurrency(product.price * quantity)}
                    </span>

                    <button
                      type="button"
                      className="cart-item-delete"
                      onClick={() => removeFromCart(product.id)}
                      title="Eliminar producto"
                      aria-label={`Eliminar ${product.name}`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pie del Carrito con Subtotal y Botón de Pago */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total-line">
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Subtotal estimado:</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                {formatCurrency(subtotal)}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0 1rem' }}>
              Impuestos y costos de envío calculados al momento de confirmar el pedido.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button
                variant="outline"
                className="btn-sm"
                onClick={clearCart}
                title="Vaciar todos los artículos"
              >
                Vaciar
              </Button>
              <Button
                variant="primary"
                onClick={handleCheckoutClick}
                style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
              >
                💳 Proceder al Pago / Pagar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
