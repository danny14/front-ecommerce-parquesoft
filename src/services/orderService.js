import { httpClient } from '../api/httpClient';

const ORDERS_STORAGE_KEY = 'ecommerce_orders_history';

/**
 * Servicio de Órdenes y Pedidos.
 * Aplica el patrón Repository / Service con persistencia dual:
 * Intenta registrar la orden contra el endpoint del backend (/api/orders) y,
 * simultáneamente, la persiste en el almacenamiento local para auditoría e historial del cliente.
 */
export const orderService = {
  /**
   * Crea una nueva orden de compra para el usuario autenticado.
   * 
   * @param {{
   *   buyer: { fullName: string, email: string },
   *   items: Array<{ product: object, quantity: number, price: number }>,
   *   shippingAddress: { address: string, city: string, phone: string, notes?: string },
   *   paymentMethod: 'credit_card' | 'pse' | 'cash_on_delivery',
   *   subtotal: number,
   *   shippingCost: number,
   *   total: number
   * }} orderData 
   * @returns {Promise<object>} Orden registrada con ID único y metadatos
   */
  async createOrder(orderData) {
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderNumber,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'CONFIRMADO',
      paymentStatus: orderData.paymentMethod === 'cash_on_delivery' ? 'PENDIENTE_PAGO' : 'PAGADO',
      ...orderData
    };

    // 1. Intento de registro en el backend Spring Boot
    try {
      const response = await httpClient.post('/orders', newOrder);
      if (response && response.id) {
        newOrder.backendId = response.id;
      }
    } catch (backendError) {
      console.warn(
        'Aviso: Endpoint /api/orders no disponible en el backend actualmente. Registrando orden localmente:',
        backendError.message
      );
    }

    // 2. Persistir en el historial local de pedidos
    try {
      const existing = this.getAllOrders();
      const updated = [newOrder, ...existing];
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error al persistir orden en localStorage:', e);
    }

    return newOrder;
  },

  /**
   * Obtiene todas las órdenes almacenadas en el sistema.
   * @returns {Array}
   */
  getAllOrders() {
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * Obtiene las órdenes asociadas al correo del usuario actualmente autenticado.
   * @param {string} userEmail 
   * @returns {Array}
   */
  getOrdersByUser(userEmail) {
    if (!userEmail) return [];
    const cleanEmail = userEmail.trim().toLowerCase();
    const all = this.getAllOrders();
    return all.filter(o => o.buyer?.email?.trim().toLowerCase() === cleanEmail);
  }
};
