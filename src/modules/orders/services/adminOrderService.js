import { instance } from '../../shared/api/axiosInstance';

/**
 * Obtiene todas las órdenes para el panel administrativo
 * @param {number} pageNumber - Número de página
 * @param {number} pageSize - Cantidad de órdenes por página
 * @returns {Promise<{data: {total, items}, error: null}|{data: null, error: string}>}
 */
export const getAllOrders = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await instance.get('api/orders/admin', {
      params: {
        pageNumber,
        pageSize,
      },
    });

    return {
      data: {
        total: response.data.totalCount || 0,
        items: response.data.items || [],
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      data: null,
      error: error.response?.data?.message || error.message || 'Error al cargar las órdenes',
    };
  }
};
