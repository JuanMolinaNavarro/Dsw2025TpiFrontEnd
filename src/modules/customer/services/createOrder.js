/**
 * Crea una nueva orden en el backend
 * @param {Array} items - Array de productos del carrito
 * @param {number} total - Total de la orden
 * @returns {Promise<Object>} Response del servidor
 */
export const createOrder = async (items, total) => {
  try {
    // Obtener token de autenticación
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    // Validar que hay items
    if (!items || items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // Preparar el body de la request
    const orderData = {
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      })),
      total: total,
      // status: 'pending',
      // paymentMethod: 'card',
      // shippingAddress: {...},
      // etc.
    };

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    // Si la respuesta no es ok, lanzar error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la orden');
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
      message: 'Orden creada exitosamente'
    };

  } catch (error) {
    console.error('Error al crear orden:', error);
    return {
      success: false,
      error: error.message,
      message: error.message || 'Error al crear la orden'
    };
  }
};

/**
 * Obtiene el historial de órdenes del cliente autenticado
 * @returns {Promise<Object>} Lista de órdenes
 */
export const getMyOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch('/api/orders/my-orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener órdenes');
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
      message: 'Órdenes obtenidas exitosamente'
    };

  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    return {
      success: false,
      error: error.message,
      message: error.message || 'Error al obtener órdenes'
    };
  }
};