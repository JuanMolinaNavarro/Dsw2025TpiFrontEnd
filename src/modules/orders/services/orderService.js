import { instance } from '../../shared/api/axiosInstance';

/**
 * Servicio para crear una nueva orden
 * 
 * @param {object} orderData - Datos de la orden
 * @param {array} orderData.items - Items de la orden [{id, quantity}, ...]
 * @returns {Promise<{data: object, error: null | string}>} Respuesta del servidor
 */
export const createOrder = async (items) => {
  try {
    // Preparamos los datos de la orden para enviar al backend
    const orderPayload = {
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    // Realizamos una petición POST al endpoint de órdenes
    const response = await instance.post('api/orders', orderPayload);

    // Retornamos la respuesta del servidor
    return { 
      data: response.data, 
      error: null 
    };
  } catch (error) {
    // Si hay un error, lo retornamos
    console.error('Error al crear la orden:', error.message);
    return { 
      data: null, 
      error: error.response?.data?.message || error.message 
    };
  }
};

/**
 * Obtiene el historial de órdenes del usuario autenticado
 * 
 * @returns {Promise<{data: array, error: null | string}>} Lista de órdenes
 */
export const getUserOrders = async () => {
  try {
    // Realizamos una petición GET al endpoint de órdenes del usuario
    const response = await instance.get('api/orders');

    // Retornamos la respuesta del servidor
    return { 
      data: response.data, 
      error: null 
    };
  } catch (error) {
    console.error('Error al obtener órdenes:', error.message);
    return { 
      data: null, 
      error: error.response?.data?.message || error.message 
    };
  }
};
