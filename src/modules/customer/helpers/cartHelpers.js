const CART_KEY = 'cart';

/**
 * Obtiene el carrito actual desde localStorage
 * @returns {Array} Array de productos en el carrito
 */
export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    return [];
  }
};

/**
 * Guarda el carrito en localStorage
 * @param {Array} cart - Array de productos
 */
const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error al guardar el carrito:', error);
  }
};

/**
 * Agrega un producto al carrito
 * @param {Object} product - Producto a agregar
 * @param {number} quantity - Cantidad a agregar
 * @returns {Object} { success: boolean, message: string, cart: Array }
 */
export const addToCart = (product, quantity) => {
  if (!product || !product.id) {
    return { success: false, message: 'Producto inválido', cart: getCart() };
  }

  if (quantity < 1) {
    return { success: false, message: 'La cantidad mínima es 1', cart: getCart() };
  }

  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === product.id);

  if (existingIndex >= 0) {
    // Producto ya existe, actualizar cantidad
    cart[existingIndex].quantity += quantity;
  } else {
    // Agregar nuevo producto
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      // Puedes agregar más campos si necesitas (imagen, descripción, etc.)
    });
  }

  saveCart(cart);
  return { success: true, message: 'Producto agregado al carrito', cart };
};

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {number|string} productId - ID del producto
 * @param {number} newQuantity - Nueva cantidad
 * @returns {Object} { success: boolean, message: string, cart: Array }
 */
export const updateQuantity = (productId, newQuantity) => {
  if (newQuantity < 0) {
    return { success: false, message: 'La cantidad no puede ser negativa', cart: getCart() };
  }

  const cart = getCart();
  const index = cart.findIndex(item => item.id === productId);

  if (index === -1) {
    return { success: false, message: 'Producto no encontrado en el carrito', cart };
  }

  if (newQuantity === 0) {
    // Si la cantidad es 0, eliminar el producto
    return removeFromCart(productId);
  }

  cart[index].quantity = newQuantity;
  saveCart(cart);
  return { success: true, message: 'Cantidad actualizada', cart };
};

/**
 * Incrementa la cantidad de un producto
 * @param {number|string} productId - ID del producto
 * @returns {Object} { success: boolean, cart: Array }
 */
export const incrementQuantity = (productId) => {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (!item) {
    return { success: false, cart };
  }

  return updateQuantity(productId, item.quantity + 1);
};

/**
 * Decrementa la cantidad de un producto
 * @param {number|string} productId - ID del producto
 * @returns {Object} { success: boolean, cart: Array }
 */
export const decrementQuantity = (productId) => {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (!item) {
    return { success: false, cart };
  }

  return updateQuantity(productId, item.quantity - 1);
};

/**
 * Elimina un producto del carrito
 * @param {number|string} productId - ID del producto a eliminar
 * @returns {Object} { success: boolean, message: string, cart: Array }
 */
export const removeFromCart = (productId) => {
  const cart = getCart();
  const filteredCart = cart.filter(item => item.id !== productId);
  
  saveCart(filteredCart);
  return { success: true, message: 'Producto eliminado del carrito', cart: filteredCart };
};

/**
 * Limpia todo el carrito
 * @returns {Object} { success: boolean, message: string, cart: Array }
 */
export const clearCart = () => {
  try {
    localStorage.removeItem(CART_KEY);
    return { success: true, message: 'Carrito vaciado', cart: [] };
  } catch (error) {
    console.error('Error al limpiar el carrito:', error);
    return { success: false, message: 'Error al limpiar el carrito', cart: getCart() };
  }
};

/**
 * Obtiene el total de productos en el carrito
 * @returns {number} Cantidad total de items
 */
export const getTotalItems = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Calcula el precio total del carrito
 * @returns {number} Precio total
 */
export const getTotalPrice = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

/**
 * Verifica si un producto está en el carrito
 * @param {number|string} productId - ID del producto
 * @returns {boolean}
 */
export const isInCart = (productId) => {
  const cart = getCart();
  return cart.some(item => item.id === productId);
};

/**
 * Obtiene la cantidad de un producto específico en el carrito
 * @param {number|string} productId - ID del producto
 * @returns {number} Cantidad del producto (0 si no está)
 */
export const getProductQuantity = (productId) => {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  return item ? item.quantity : 0;
};