import { instance } from '../../shared/api/axiosInstance.js';

/**
 * Obtiene todas las órdenes (para admin) con filtros y paginación
 * @param {string} search - Término de búsqueda
 * @param {string} status - Estado de la orden (Pending, Processing, Shipped, Delivered, Cancelled)
 * @param {number} pageNumber - Número de página
 * @param {number} pageSize - Tamaño de página
 * @returns {Promise} Promesa con la lista de órdenes
 */
export const getOrders = async (search = '', status = '', pageNumber = 1, pageSize = 10) => {
  try {
    const params = { pageNumber, pageSize };

    // Backend espera "search"
    if (search) params.search = search;

    // Backend espera "status"
    if (status) params.status = status;

    const response = await instance.get('/api/orders/admin', { params });

    return {
    data: response.data || response,
    error: null
     };

  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    return { data: null, error };
  }
};

/**
 * Obtiene la cantidad total de órdenes
 */
export const getOrdersCount = async () => {
  try {
    const response = await instance.get('/api/orders/admin');
    return response.data?.totalCount || 0;
  } catch (error) {
    console.error('Error al obtener cantidad de órdenes:', error);
    throw error;
  }
};

/**
 * Obtiene una orden por ID
 */
export const getOrderById = async (id) => {
  try {
    const response = await instance.get(`/api/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener orden:', error);
    throw error;
  }
};

/**
 * Actualiza el estado de una orden
 */
export const updateOrderStatus = async (id, newStatus) => {
  try {
    const response = await instance.put(`/api/orders/${id}/status`, { newStatus });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar estado de orden:', error);
    throw error;
  }
};
