import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (search = null, status = null, pageNumber = 1, pageSize = 20 ) => {
  const queryString = new URLSearchParams({
    search,
    status,
    pageNumber,
    pageSize,
  });

  try {
    const response = await instance.get(`api/products/admin?${queryString}`);

    return { 
      data: { 
        productItems: response.data.items.map(item => ({
          ...item,
          stockQuantity: item.stockQuantity
        })), 
        total: response.data.totalCount 
      }, 
      error: null 
    };
  } catch (error) {
    // Si el backend devuelve "No hay productos disponibles", devolvemos lista vacía
    if (error.response?.status === 400 && error.response?.data?.code === 'NO_PRODUCTS_AVAILABLE') {
      return { 
        data: { 
          productItems: [], 
          total: 0 
        }, 
        error: null 
      };
    }
    
    return { data: null, error: error };
  }
};