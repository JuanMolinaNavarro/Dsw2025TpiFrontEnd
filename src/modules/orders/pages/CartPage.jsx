import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/components/Header";
import AuthModal from "../../auth/components/AuthModal";
import CheckoutModal from "../components/CheckoutModal";
import useAuth from "../../auth/hook/useAuth";

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

  // Estado para mostrar el modal de checkout
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

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
  const token = localStorage.getItem("token");

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
      const token = localStorage.getItem("token");

      if (!token) {
        // Vaciar carrito si no hay sesión activa
        setCartItems([]);
        localStorage.removeItem("cart");
        return;
      }

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
    } catch (err) {
      console.error("Error al cargar el carrito:", err);
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
    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    // Guardamos en localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  /**
   * Remueve un producto del carrito
   * @param {number} productId - ID del producto a remover
   */
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    // Guardamos en localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  /**
   * Calcula el subtotal del carrito
   * @returns {number} Subtotal sin impuestos
   */
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.currentUnitPrice * item.quantity;
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
   * Maneja el clic en el botón "Finalizar Compra"
   * Valida que hay items y muestra el modal de checkout
   */
  const handleCheckout = () => {
    // Validar que hay items en el carrito
    if (cartItems.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    // Si el usuario no está autenticado, mostramos el modal de login
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    // Si el usuario está autenticado, mostramos el modal de checkout
    setShowCheckoutModal(true);
  };

  /**
   * Maneja el éxito de la orden
   * Muestra confirmación y redirige a la página principal
   */
  const handleOrderSuccess = (orderData) => {
    setOrderConfirmation(orderData);
    setShowCheckoutModal(false);

    // Limpiamos el carrito
    setCartItems([]);
    localStorage.removeItem("cart");

    // Redirigimos después de 3 segundos
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  /**
   * Vacía todo el carrito
   */
  const handleClearCart = () => {
    if (window.confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
      setCartItems([]);
      localStorage.removeItem("cart");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <Header />

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-50">
            Carrito de Compras
          </h1>
        </div>

        {/* Mostrar confirmación de orden si existe */}
        {orderConfirmation && (
          <div className="bg-green-950 border border-green-400 text-green-400 px-6 py-4 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-2">✓ ¡Orden Confirmada!</h2>
            <p className="mb-2">Tu orden ha sido creada exitosamente.</p>
            <p className="text-sm">
              Número de orden: <strong>{orderConfirmation.id}</strong>
            </p>
            <p className="text-sm mt-2">
              Serás redirigido a la página principal en breve...
            </p>
          </div>
        )}

        {/* Mostrar error si existe */}
        {error && (
          <div className="bg-red-950 border border-red-400 text-red-400 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Si el carrito está vacío */}
        {cartItems.length === 0 && !orderConfirmation && (
          <div className="bg-zinc-900 rounded-lg p-12 text-center">
            <p className="text-zinc-200 text-lg mb-4">Tu carrito está vacío</p>
            <button
              onClick={() => navigate("/")}
              className="w-60 shadow-s p-4 bg-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 disabled:bg-gray-400 disabled:cursor-not-allowed
                               text-white font-bold py-3 rounded-lg transition"
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
              <div className="bg-zinc-900 rounded-lg shadow-s p-4 text-white">
                {/* Encabezado de la tabla */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-zinc-50">
                    <div>Producto</div>
                    <div className="text-center">Cantidad</div>
                    <div className="text-right">Precio Unitario</div>
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
                          <p className="font-semibold text-zinc-50 line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-sm text-zinc-400 mt-1">
                            SKU: {item.sku || "N/A"}
                          </p>
                        </div>

                        {/* Cantidad */}
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-10 h-10 shadow-s rounded-xl p-4 bg-zinc-900 text-white flex items-center justify-center 
                         hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition hover:text-zinc-950"
                          >
                            −
                          </button>
                          <p className="p-4">{item.quantity}</p>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-10 h-10 shadow-s rounded-xl p-4 bg-zinc-900 text-white flex items-center justify-center 
                         hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition hover:text-zinc-950"
                          >
                            +
                          </button>
                        </div>

                        {/* Precio unitario */}
                        <div className="text-right">
                          <p className="text-zinc-50">
                            ${item.currentUnitPrice.toFixed(2)}
                          </p>
                        </div>

                        {/* Total del item */}
                        <div className="text-right">
                          <p className="text-lg text-zinc-50">
                            $
                            {(item.currentUnitPrice * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="hover:bg-red-950 hover:text-red-400 text-zinc-50 bg-zinc-900  shadow-s text-sm mt-1 transition p-3"
                          >
                            Quitar
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
              <div className="bg-zinc-900 rounded-lg shadow p-6 sticky top-8 shadow-s   text-white transition">
                {/* Título */}
                <h2 className="text-xl font-bold text-zinc-50 mb-6">
                  Resumen de Compra
                </h2>

                {/* Detalles */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Subtotal</span>
                    <span className="font-semibold">
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>

                  {/* Impuestos */}
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Impuestos (21%)</span>
                    <span className="font-semibold">
                      ${(calculateSubtotal() * 0.21).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-zinc-400">Total</span>
                  <span className="text-2xl font-bold text-zinc-50">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>

                {/* Botones */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full shadow-s p-4 bg-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 disabled:bg-gray-400 disabled:cursor-not-allowed
                               text-zinc-50 font-bold py-3 rounded-lg transition"
                  >
                    {loading ? "Procesando..." : "Finalizar Compra"}
                  </button>

                  <button
                    onClick={handleClearCart}
                    className="w-full shadow-s p-4 bg-zinc-900 hover:bg-red-950 hover:text-red-400 disabled:bg-gray-400 disabled:cursor-not-allowed
                               text-white font-bold py-3 rounded-lg transition"
                  >
                    Vaciar Carrito
                  </button>

                  <button
                    onClick={() => navigate("/")}
                    className="w-full shadow-s p-4 bg-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 disabled:bg-gray-400 disabled:cursor-not-allowed
                               text-white font-bold py-3 rounded-lg transition"
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
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* Modal de checkout */}
      {showCheckoutModal && (
        <CheckoutModal
          cartItems={cartItems}
          onClose={() => setShowCheckoutModal(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}

export default CartPage;
