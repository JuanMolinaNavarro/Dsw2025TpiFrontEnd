import { instance } from '../../shared/api/axiosInstance';

// Función para administradores (endpoint protegido)
export const getProducts = async (search = null, status = null, pageNumber = 1, pageSize = 20) => {
  const queryParams = new URLSearchParams();
  
  if (search) queryParams.append('search', search);
  if (status) queryParams.append('status', status);
  queryParams.append('pageNumber', pageNumber);
  queryParams.append('pageSize', pageSize);

  try {
    const response = await instance.get(`api/products/admin?${queryParams}`);

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

// FUNCIÓN: Para clientes/público (sin autenticación)
export const getPublicProducts = async (page = 1, limit = 12, search = '') => {
  const queryParams = new URLSearchParams();
  
  queryParams.append('pageNumber', page);
  queryParams.append('pageSize', limit);
  if (search && search.trim()) {
    queryParams.append('search', search.trim());
  }

  try {
    const response = await instance.get(`api/products?${queryParams}`); 

    return {
      data: {
        products: response.data.items || [],
        totalPages: Math.ceil(response.data.totalCount / limit) || 1,
        totalCount: response.data.totalCount || 0
      },
      error: null
    };
  } catch (error) {
    console.error('Error al cargar productos públicos:', error);
    
    if (error.response?.status === 400) {
      return {
        data: {
          products: [],
          totalPages: 1,
          totalCount: 0
        },
        error: null
      };
    }

    return {
      data: null,
      error: error.response?.data?.message || 'Error al cargar productos'
    };
  }
};