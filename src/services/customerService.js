import { httpClient } from '../api/httpClient';

/**
 * Servicio de Clientes: Encapsula el contrato de endpoints de /api/customers
 */
export const customerService = {
  /**
   * Obtiene la lista completa de clientes
   * @returns {Promise<Array>}
   */
  async getAll() {
    return httpClient.get('/customers');
  },

  /**
   * Busca un cliente por correo electrónico
   * @param {string} email 
   */
  async getByEmail(email) {
    return httpClient.get(`/customers/email/${encodeURIComponent(email)}`);
  },

  /**
   * Obtiene la lista de clientes VIP
   * @param {number} minPoints 
   */
  async getVip(minPoints = 100) {
    return httpClient.get(`/customers/vip?minPoints=${minPoints}`);
  },

  /**
   * Registra un nuevo cliente
   * @param {{ fullName: string, email: string, loyaltyPoints: number }} customerData 
   */
  async create(customerData) {
    return httpClient.post('/customers', customerData);
  },

  /**
   * Actualiza los datos de un cliente
   * @param {number|string} id 
   * @param {object} customerData 
   */
  async update(id, customerData) {
    return httpClient.put(`/customers/${id}`, customerData);
  },

  /**
   * Desactiva un cliente (soft delete)
   * @param {number|string} id 
   */
  async delete(id) {
    return httpClient.delete(`/customers/${id}`);
  }
};
