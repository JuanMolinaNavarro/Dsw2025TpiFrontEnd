import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import { createOrder } from '../services/orderService';
import AuthModal from '../../auth/components/AuthModal';
import useAuth from '../../auth/hook/useAuth';

/**
 * Página de Carrito de Compras
 * 
 * Muestra:
 * - Listado de items en el carrito
 * - Opciones para modificar cantidades
 * - Totales (subtotal, impuestos, total)
 * - Botón para finalizar compra
 * 
 * @component
 * @returns {JSX.Element} Página del carrito
 */
function CartPage() {
  // Estado para almacenar los items del carrito
  const [cartItems, setCartItems] = useState([]);
  
  // Estado para mostrar el modal de autenticación
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Estado para el estado de carga durante el checkout
  const [loading, setLoading] = useState(false);
  
  // Estado para mostrar mensajes de error
  const [error, setError] = useState(null);
  
  // Estado para mostrar confirmación de orden
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  
  // Hook para navegar entre páginas
  const navigate = useNavigate();
  
  // Hook para obtener el estado de autenticación
  const { isAuthenticated } = useAuth();
  
  // Obtenemos el token para saber si el usuario está autenticado
  const token = localStorage.getItem('token');

  /**
   * Efecto que se ejecuta al cargar la página y cuando cambia la autenticación
   * Carga los items del carrito desde localStorage
   */
  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  /**
   * Carga el carrito desde localStorage
   * Si no hay token (usuario no autenticado), vacía el carrito
   */
  const loadCart = () => {
    try {
      // Si no hay token, el usuario no está autenticado
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Vaciar carrito si no hay sesión activa
        setCartItems([]);
        localStorage.removeItem('cart');
        return;
      }
      
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(cart);
    } catch (err) {
      console.error('Error al cargar el carrito:', err);
      setCartItems([]);
    }
  };

  /**
   * Actualiza la cantidad de un producto en el carrito
   * @param {number} productId - ID del producto a actualizar
   * @param {number} newQuantity - Nueva cantidad
   */
  const updateQuantity = (productId, newQuantity) => {
    // Validar que la cantidad sea válida
    if (newQuantity < 0) return;

    // Si la cantidad es 0, removemos el item
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }

    // Actualizamos la cantidad
    const updatedCart = cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );

    setCartItems(updatedCart);
    // Guardamos en localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  /**
   * Remueve un producto del carrito
   * @param {number} productId - ID del producto a remover
   */
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    // Guardamos en localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  /**
   * Calcula el subtotal del carrito
   * @returns {number} Subtotal sin impuestos
   */
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.currentUnitPrice * item.quantity);
    }, 0);
  };

  /**
   * Calcula el total con impuestos
   * Asumimos 21% de IVA (impuesto argentino)
   * @returns {number} Total con impuestos
   */
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxRate = 0.21; // 21% IVA
    const taxes = subtotal * taxRate;
    return subtotal + taxes;
  };

  /**
   * Maneja el checkout y la creación de la orden
   */
  const handleCheckout = async () => {
    // Validar que hay items en el carrito
    if (cartItems.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    // Si el usuario no está autenticado, mostramos el modal de login
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    try {
      // Mostramos el indicador de carga
      setLoading(true);
      setError(null);

      // Llamamos al servicio para crear la orden
      const { data, error: orderError } = await createOrder(cartItems);

      // Si hay un error, lo mostramos
      if (orderError) {
        setError(orderError);
        return;
      }

      // Si es exitoso, mostramos la confirmación
      setOrderConfirmation(data);
      
      // Limpiamos el carrito
      setCartItems([]);
      localStorage.removeItem('cart');

      // Redirigimos después de 3 segundos
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError('Error inesperado al crear la orden');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Vacía todo el carrito
   */
  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Carrito de Compras
          </h1>
        </div>

        {/* Mostrar confirmación de orden si existe */}
        {orderConfirmation && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-2">✓ ¡Orden Confirmada!</h2>
            <p className="mb-2">Tu orden ha sido creada exitosamente.</p>
            <p className="text-sm">Número de orden: <strong>{orderConfirmation.id}</strong></p>
            <p className="text-sm mt-2">Serás redirigido a la página principal en breve...</p>
          </div>
        )}

        {/* Mostrar error si existe */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Si el carrito está vacío */}
        {cartItems.length === 0 && !orderConfirmation && (
          <div className="bg-gray-100 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              Tu carrito está vacío
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Volver a Productos
            </button>
          </div>
        )}

        {/* Carrito con items */}
        {cartItems.length > 0 && !orderConfirmation && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Lista de items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                
                {/* Encabezado de la tabla */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-900">
                    <div>Producto</div>
                    <div className="text-center">Cantidad</div>
                    <div className="text-right">Precio</div>
                    <div className="text-right">Total</div>
                  </div>
                </div>

                {/* Items del carrito */}
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="px-6 py-4">
                      <div className="grid grid-cols-4 gap-4 items-center">
                        
                        {/* Producto */}
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            SKU: {item.sku || 'N/A'}
                          </p>
                        </div>

                        {/* Cantidad */}
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                            className="w-12 h-8 text-center border border-gray-300 rounded"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition"
                          >
                            +
                          </button>
                        </div>

                        {/* Precio unitario */}
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${item.currentUnitPrice.toFixed(2)}
                          </p>
                        </div>

                        {/* Total del item */}
                        <div className="text-right">
                          <p className="font-bold text-lg text-purple-600">
                            ${(item.currentUnitPrice * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm mt-1 transition"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resumen de compra */}
            <div>
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                
                {/* Título */}
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Resumen de Compra
                </h2>

                {/* Detalles */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>

                  {/* Impuestos */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Impuestos (21%)</span>
                    <span className="font-semibold">
                      ${(calculateSubtotal() * 0.21).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-purple-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>

                {/* Botones */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                               text-white font-bold py-3 rounded-lg transition"
                  >
                    {loading ? 'Procesando...' : 'Finalizar Compra'}
                  </button>

                  <button
                    onClick={handleClearCart}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition"
                  >
                    Vaciar Carrito
                  </button>

                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 rounded-lg transition"
                  >
                    Continuar Comprando
                  </button>
                </div>

                {/* Nota de autenticación */}
                {!token && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Necesitas iniciar sesión para finalizar la compra
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de autenticación */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

export default CartPage;
