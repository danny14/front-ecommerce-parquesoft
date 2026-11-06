/**
 * Utilidades de validación, formateo defensivo y metadata visual de e-commerce.
 * Aplica principios de Clean Code y validación temprana en el cliente.
 */

/**
 * Valida un correo electrónico con expresión regular estándar RFC 5322 simplificada.
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Valida los datos de entrada para la creación/edición de un Producto.
 * @param {{ name: string, price: number|string, sku: string, stock: number|string }} data 
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateProductData(data) {
  const errors = {};

  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.name = 'El nombre del producto es obligatorio.';
  } else if (data.name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres.';
  }

  if (!data.sku || typeof data.sku !== 'string' || !data.sku.trim()) {
    errors.sku = 'El código SKU es obligatorio.';
  } else if (!/^[A-Za-z0-9-_]+$/.test(data.sku.trim())) {
    errors.sku = 'El SKU solo puede contener caracteres alfanuméricos, guiones o guiones bajos.';
  }

  const priceNum = Number(data.price);
  if (data.price === '' || isNaN(priceNum) || priceNum <= 0) {
    errors.price = 'El precio debe ser un número estrictamente mayor a 0.';
  }

  const stockNum = Number(data.stock);
  if (data.stock === '' || isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
    errors.stock = 'El stock debe ser un número entero mayor o igual a 0.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Valida los datos de entrada para la creación/edición de un Cliente.
 * @param {{ fullName: string, email: string, loyaltyPoints: number|string }} data 
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateCustomerData(data) {
  const errors = {};

  if (!data.fullName || typeof data.fullName !== 'string' || !data.fullName.trim()) {
    errors.fullName = 'El nombre completo es obligatorio.';
  } else if (data.fullName.trim().length < 3) {
    errors.fullName = 'El nombre debe tener al menos 3 caracteres.';
  }

  if (!isValidEmail(data.email)) {
    errors.email = 'Debe proporcionar un correo electrónico válido (ej. usuario@dominio.com).';
  }

  const pointsNum = Number(data.loyaltyPoints);
  if (data.loyaltyPoints === '' || isNaN(pointsNum) || pointsNum < 0 || !Number.isInteger(pointsNum)) {
    errors.loyaltyPoints = 'Los puntos de fidelidad deben ser un número entero mayor o igual a 0.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Formatea un valor numérico a dólares con la nomenclatura solicitada "US$".
 * Ejemplo: 10000 -> "US$ 10,000.00"
 * @param {number|string} amount 
 * @returns {string}
 */
export function formatCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return 'US$ 0.00';
  return `US$ ${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)}`;
}

/**
 * Provee imágenes profesionales de productos tecnológicos de alta definición
 * según el nombre o SKU, transformando la apariencia en una tienda real.
 * @param {object} product 
 * @returns {string} URL de imagen
 */
export function getProductImage(product) {
  if (!product) return 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';
  
  const name = (product.name || '').toLowerCase();
  
  if (name.includes('portatil') || name.includes('laptop') || name.includes('macbook')) {
    return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('escritorio') || name.includes('pc') || name.includes('desktop') || name.includes('gamer')) {
    return 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('monitor') || name.includes('pantalla')) {
    return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('teclado') || name.includes('keyboard')) {
    return 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('mouse') || name.includes('raton')) {
    return 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('audifonos') || name.includes('auriculares') || name.includes('headset')) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80';
  }

  // Fallback para gadgets y tecnología
  return 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';
}

/**
 * Asigna una categoría comercial para filtrado por chips en la tienda.
 * @param {object} product 
 * @returns {string} Categoría
 */
export function getProductCategory(product) {
  if (!product) return 'Tecnología';
  const name = (product.name || '').toLowerCase();
  if (name.includes('portatil') || name.includes('laptop')) return 'Laptops';
  if (name.includes('pc') || name.includes('escritorio')) return 'Computadores';
  if (name.includes('monitor') || name.includes('pantalla')) return 'Monitores';
  if (name.includes('teclado') || name.includes('mouse') || name.includes('audifono')) return 'Periféricos';
  return 'Accesorios';
}
