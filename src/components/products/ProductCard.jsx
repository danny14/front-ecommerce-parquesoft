import React, { useState } from 'react';
import { formatCurrency, getProductImage, getProductCategory } from '../../utils/validators';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';

/**
 * Tarjeta de producto de tienda moderna y profesional (E-Commerce Storefront).
 * Incorpora imagen de alta calidad, calificaciones, descuentos simulados,
 * badges de stock, botón de añadir al carrito y botón directo de "Pagar / Comprar Ahora".
 * 
 * @param {{
 *   product: { id: number|string, name: string, sku: string, price: number, stock: number, active: boolean },
 *   onViewDetail: (product: object) => void
 * }} props
 */
export function ProductCard({ product, onViewDetail }) {
  const { addToCart, buyNowSingleProduct } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const category = getProductCategory(product);
  const imageUrl = getProductImage(product);

  // Precio de referencia original para simular descuento comercial de tienda
  const originalPrice = product.price * 1.18;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      const res = addToCart(product, 1);
      if (res.success) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1800);
      }
    }
  };

  const handleDirectBuy = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      buyNowSingleProduct(product, 1);
    }
  };

  return (
    <div className="store-product-card card" onClick={() => onViewDetail(product)}>
      {/* Contenedor de Imagen y Badges Comerciales */}
      <div className="store-product-image-wrap">
        <img
          src={imageUrl}
          alt={product.name}
          className="store-product-img"
          loading="lazy"
        />

        {/* Badges superiores */}
        <div className="store-badge-top-left">
          <span className="badge badge-category">{category}</span>
        </div>

        <div className="store-badge-top-right">
          {isOutOfStock ? (
            <span className="badge badge-danger">AGOTADO</span>
          ) : isLowStock ? (
            <span className="badge badge-warning">¡ÚLTIMAS {product.stock}!</span>
          ) : (
            <span className="badge badge-success">-18% OFF</span>
          )}
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="store-product-content">
        <div className="store-product-meta">
          <span className="store-product-sku">SKU: {product.sku}</span>
          <div className="store-product-rating">
            <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>★★★★★</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
              4.9 (38)
            </span>
          </div>
        </div>

        <h3 className="store-product-name" title={product.name}>
          {product.name}
        </h3>

        <div className="store-shipping-badge">
          <span>🚚 Envío Gratis Nacional</span>
        </div>

        {/* Precios */}
        <div className="store-price-container">
          <span className="store-price-original">
            {formatCurrency(originalPrice)}
          </span>
          <div className="store-price-main">
            <span className="store-price-val">{formatCurrency(product.price)}</span>
            <span className="store-price-installment">en 3x {formatCurrency(product.price / 3)} sin interés</span>
          </div>
        </div>

        {/* Barra de Existencias */}
        <div className="store-stock-indicator">
          <div className="store-stock-bar">
            <div
              className={`store-stock-fill ${isOutOfStock ? 'empty' : isLowStock ? 'low' : ''}`}
              style={{ width: `${Math.min(100, Math.max(10, (product.stock / 20) * 100))}%` }}
            />
          </div>
          <span className="store-stock-text">
            {isOutOfStock ? 'Sin stock disponible' : `Disponibles: ${product.stock} unidades`}
          </span>
        </div>

        {/* Botones de Acción de Compra */}
        <div className="store-product-actions">
          <Button
            variant={justAdded ? 'secondary' : 'outline'}
            className="btn-sm store-btn-add"
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            title="Añadir 1 unidad a la cesta de compras"
          >
            {justAdded ? '✅ ¡Listo!' : '🛒 Añadir'}
          </Button>

          <Button
            variant="primary"
            className="btn-sm store-btn-buy"
            disabled={isOutOfStock}
            onClick={handleDirectBuy}
            title="Proceder a pagar este producto de inmediato"
          >
            ⚡ Pagar Ahora
          </Button>
        </div>
      </div>
    </div>
  );
}
