import { httpClient } from '../api/httpClient';

/**
 * Servicio de Productos: Encapsula el contrato de endpoints de /api/products
 */
export const productService = {
  /**
   * Obtiene la lista completa de productos
   * @returns {Promise<Array>}
   */
  async getAll() {
    return httpClient.get('/products');
  },

  /**
   * Busca un producto por su SKU exacto
   * @param {string} sku 
   */
  async getBySku(sku) {
    return httpClient.get(`/products/sku/${encodeURIComponent(sku)}`);
  },

  /**
   * Filtra productos activos por rango de precio
   * @param {number} min 
   * @param {number} max 
   */
  async searchByPrice(min = 0, max = 999999) {
    return httpClient.get(`/products/search?min=${min}&max=${max}`);
  },

  /**
   * Crea un nuevo producto validando campos mínimos
   * @param {{ name: string, price: number, sku: string, stock: number }} productData 
   */
  async create(productData) {
    return httpClient.post('/products', productData);
  },

  /**
   * Actualiza los datos de un producto por ID
   * @param {number|string} id 
   * @param {object} productData 
   */
  async update(id, productData) {
    return httpClient.put(`/products/${id}`, productData);
  },

  /**
   * Ejecuta borrado lógico (active = false)
   * @param {number|string} id 
   */
  async delete(id) {
    return httpClient.delete(`/products/${id}`);
  }
};
