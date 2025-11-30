import { instance } from '../../shared/api/axiosInstance';

export const listOrders = async (search = null, status = null, pageNumber = 1, pageSize = 10) => {
  const queryString = new URLSearchParams({
    search,
    status,
    pageNumber,
    pageSize,
  });

  try {
    const response = await instance.get(`/api/orders?${queryString}`);

    return { 
      data: { 
        orderItems: response.data.items, 
        total: response.data.totalCount 
      }, 
      error: null 
    };
  } catch (error) {
    // Si no hay órdenes, devolver lista vacía
    if (error.response?.status === 400 && error.response?.data?.code === 'NO_ORDERS_AVAILABLE') {
      return { 
        data: { 
          orderItems: [], 
          total: 0 
        }, 
        error: null 
      };
    }
    
    console.error('Error fetching orders:', error);
    return { data: null, error: error };
  }
};
