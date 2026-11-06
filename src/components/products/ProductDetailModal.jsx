import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { formatCurrency, getProductImage, getProductCategory } from '../../utils/validators';
import { useCart } from '../../context/CartContext';

/**
 * Modal de Ficha Técnica Detallada de Producto.
 * Diseñado con estética de e-commerce real (fotografía, cuotas, especificaciones,
 * selector de cantidad y botones para agregar al carrito o pagar inmediatamente).
 * 
 * @param {{
 *   product: object | null,
 *   isOpen: boolean,
 *   onClose: () => void
 * }} props
 */
export function ProductDetailModal({ product, isOpen, onClose }) {
  const { addToCart, buyNowSingleProduct } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setAddedSuccess(false);
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock <= 0;
  const imageUrl = getProductImage(product);
  const category = getProductCategory(product);
  const originalPrice = product.price * 1.18;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const result = addToCart(product, quantity);
    if (result.success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }
  };

  const handlePayNow = () => {
    if (isOutOfStock) return;
    onClose();
    buyNowSingleProduct(product, quantity);
  };

  return (
    <Modal
      isOpen={isOpen}
      title={`Ficha de Producto: ${product.name}`}
      onClose={onClose}
    >
      <div className="product-detail-layout">
        {/* Columna Izquierda: Imagen y Badges */}
        <div className="product-detail-media">
          <div className="product-detail-img-box">
            <img
              src={imageUrl}
              alt={product.name}
              className="product-detail-img"
            />
            <span className="badge badge-category" style={{ position: 'absolute', top: '10px', left: '10px' }}>
              {category}
            </span>
          </div>
          <div className="product-detail-trust-pills">
            <span>🛡️ Garantía 1 Año</span>
            <span>🚚 Despacho Inmediato</span>
            <span>↩️ 30 Días Devolución</span>
          </div>
        </div>

        {/* Columna Derecha: Especificaciones y Acciones */}
        <div className="product-detail-info">
          <div className="store-product-meta" style={{ marginBottom: '0.4rem' }}>
            <span className="store-product-sku">CÓDIGO: {product.sku}</span>
            <div className="store-product-rating">
              <span style={{ color: '#f59e0b' }}>★★★★★</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                4.9 (142 valoraciones de compradores)
              </span>
            </div>
          </div>

          <h2 className="product-detail-title">{product.name}</h2>

          {/* Precios y Cuotas */}
          <div className="product-detail-pricing">
            <span className="store-price-original">
              {formatCurrency(originalPrice)}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span className="product-detail-price-main">
                {formatCurrency(product.price)}
              </span>
              <span className="badge badge-success">-18% DESCUENTO</span>
            </div>
            <p className="product-detail-installments">
              💳 Paga hasta en 12 cuotas de {formatCurrency(product.price / 12)} con tarjetas participantes
            </p>
          </div>

          {/* Estado de Existencias */}
          <div style={{ margin: '1rem 0' }}>
            <span className={`badge ${isOutOfStock ? 'badge-danger' : 'badge-success'}`}>
              {isOutOfStock
                ? 'Agotado Temporalmente'
                : `Inventario disponible: ${product.stock} unidades en bodega`}
            </span>
          </div>

          {/* Especificaciones Comerciales */}
          <div className="product-detail-specs">
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Lo que tienes que saber de este producto:
            </h4>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '1.2rem' }}>
              <li>Producto 100% original con trazabilidad oficial en base de datos.</li>
              <li>Empaque sellado de fábrica con manuales y accesorios completos.</li>
              <li>Soporte técnico posventa directo a través de nuestra plataforma.</li>
            </ul>
          </div>

          {addedSuccess && (
            <div style={{ marginTop: '0.75rem' }}>
              <Alert
                type="success"
                message={`¡Se añadieron ${quantity} unidad(es) a tu carrito de compras!`}
              />
            </div>
          )}

          {/* Selector de Cantidad */}
          <div className="product-detail-purchase-row">
            <div className="quantity-control-wrapper">
              <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                Cantidad:
              </span>
              <div className="quantity-control">
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || isOutOfStock}
                  aria-label="Restar una unidad"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock || isOutOfStock}
                  aria-label="Sumar una unidad"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total acumulado según cantidad */}
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subtotal:</span>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>
                {formatCurrency(product.price * quantity)}
              </p>
            </div>
          </div>

          {/* Botones de Acción de Compra */}
          <div className="product-detail-cta-group">
            <Button
              variant="outline"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              style={{ flex: 1 }}
            >
              🛒 Añadir al Carrito
            </Button>
            <Button
              variant="primary"
              disabled={isOutOfStock}
              onClick={handlePayNow}
              style={{ flex: 1.2 }}
            >
              ⚡ Pagar / Comprar Ahora
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
