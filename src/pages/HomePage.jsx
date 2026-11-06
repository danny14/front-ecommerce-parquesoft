import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/products/ProductCard';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Alert } from '../components/common/Alert';
import { Button } from '../components/common/Button';
import { getProductCategory } from '../utils/validators';

// Catálogo de respaldo representativo para demostración inmediata en clase
// en caso de que el backend Spring Boot no esté iniciado en ese instante
const DEMO_FALLBACK_PRODUCTS = [
  { id: 1, name: 'Portátil Gamer Ultra 16GB', sku: 'LAP-GAMER-01', price: 10000, stock: 10, active: true },
  { id: 2, name: 'PC de Escritorio Workstation Core i7', sku: 'PC-WORK-02', price: 5000, stock: 50, active: true },
  { id: 3, name: 'Monitor Curvo 27" 144Hz Full HD', sku: 'MON-CURV-27', price: 2800, stock: 15, active: true },
  { id: 4, name: 'Teclado Mecánico RGB Switch Blue', sku: 'KB-MECH-RGB', price: 650, stock: 25, active: true },
  { id: 5, name: 'Mouse Inalámbrico Ergonómico Pro', sku: 'MOU-ERG-PRO', price: 320, stock: 40, active: true },
  { id: 6, name: 'Auriculares Inalámbricos Noise Cancelling', sku: 'HEAD-NC-PRO', price: 1200, stock: 8, active: true }
];

/**
 * Página Principal / Storefront de la Tienda de E-Commerce.
 * Diseñada para simular una tienda real de tecnología:
 * Hero banner, tarjetas de confianza, filtros por categorías, selector de orden
 * y cuadrícula de productos de alta conversión.
 */
export function HomePage() {
  const { products, isLoading, error, reload } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'name-asc'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Si el backend no tiene productos o está fuera de línea, usar catálogo de demostración
  const baseProducts = useMemo(() => {
    if (products && products.length > 0) return products;
    return DEMO_FALLBACK_PRODUCTS;
  }, [products]);

  // Lista única de categorías
  const categories = useMemo(() => {
    const set = new Set(baseProducts.map(p => getProductCategory(p)));
    return ['Todos', ...Array.from(set)];
  }, [baseProducts]);

  // Filtrado y ordenamiento reactivo
  const filteredAndSortedProducts = useMemo(() => {
    let list = baseProducts.filter((p) => {
      const isActive = p.active !== false;
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Todos' || getProductCategory(p) === selectedCategory;

      return isActive && matchesSearch && matchesCategory;
    });

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [baseProducts, searchTerm, selectedCategory, sortBy]);

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="storefront-page">
      {/* 1. HERO BANNER PRINCIPAL (Aspecto de Tienda Real) */}
      <section className="storefront-hero">
        <div className="storefront-hero-content">
          <div className="hero-badge-pill">
            🔥 TECNOLOGÍA PROFESIONAL 2026 • HASTA 25% OFF
          </div>
          <h1 className="storefront-hero-title">
            Tu Tienda Especializada en Equipos de Alto Rendimiento
          </h1>
          <p className="storefront-hero-subtitle">
            Portátiles de última generación, computadores ensamblados y accesorios oficiales
            con despacho asegurado a todo el país y garantía extendida.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn btn-primary hero-btn-main"
              onClick={() => {
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              ⚡ Ver Catálogo y Ofertas
            </button>
            <div className="hero-stats">
              <span>⭐ <strong>4.9 / 5</strong> satisfacción</span>
              <span>🚚 <strong>+1,500</strong> envíos entregados</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BARRA DE BENEFICIOS / CONFIANZA */}
      <section className="store-benefits-bar">
        <div className="benefit-card">
          <span className="benefit-icon">🚚</span>
          <div>
            <strong>Envío Gratis Nacional</strong>
            <p>En pedidos mayores a $50.000</p>
          </div>
        </div>

        <div className="benefit-card">
          <span className="benefit-icon">🛡️</span>
          <div>
            <strong>Garantía Oficial 1 Año</strong>
            <p>Directa con soporte técnico</p>
          </div>
        </div>

        <div className="benefit-card">
          <span className="benefit-icon">💳</span>
          <div>
            <strong>Pago Seguro SSL</strong>
            <p>Tarjetas, PSE y Contra Entrega</p>
          </div>
        </div>

        <div className="benefit-card">
          <span className="benefit-icon">💬</span>
          <div>
            <strong>Asesoría Especializada</strong>
            <p>Acompañamiento en tu compra</p>
          </div>
        </div>
      </section>

      {/* 3. BARRA DE HERRAMIENTAS, BÚSQUEDA Y CATEGORÍAS */}
      <section id="catalog-section" className="store-catalog-header card">
        {/* Categorías por Chips */}
        <div className="category-chips-list">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'Todos' ? '🌐 Todos los Productos' : cat}
            </button>
          ))}
        </div>

        {/* Buscador y Ordenamiento */}
        <div className="store-toolbar-row">
          <div className="search-bar-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre, modelo o código SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Limpiar búsqueda"
              >
                &times;
              </button>
            )}
          </div>

          <div className="store-sort-container">
            <label htmlFor="store-sort-select" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Ordenar por:
            </label>
            <select
              id="store-sort-select"
              className="store-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Destacados y Relevancia</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A a Z</option>
            </select>

            <Button variant="outline" className="btn-sm" onClick={reload} disabled={isLoading}>
              🔄 Refrescar
            </Button>
          </div>
        </div>
      </section>

      {/* Estados de Carga y Error */}
      {isLoading && <LoadingSpinner message="Consultando productos disponibles en el catálogo..." />}

      {error && !isLoading && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Alert
            type="warning"
            message={`Aviso de red: ${error}. Mostrando catálogo de demostración para pruebas de tienda.`}
          />
        </div>
      )}

      {/* 4. CUADRÍCULA DE PRODUCTOS (Store Grid) */}
      {!isLoading && (
        <>
          {filteredAndSortedProducts.length === 0 ? (
            <div className="card store-empty-state">
              <span role="img" aria-label="Sin resultados" style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>
                🔎
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                No encontramos productos que coincidan con tus filtros
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Prueba buscando otro término o restablece la categoría seleccionada.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Todos');
                }}
              >
                Restablecer Filtros
              </Button>
            </div>
          ) : (
            <div className="store-products-grid">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetail={handleOpenDetail}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de Detalle de Producto Individual */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
