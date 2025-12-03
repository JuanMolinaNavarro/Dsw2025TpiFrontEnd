import { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import useAuth from '../../modules/auth/hook/useAuth';
import { useCart } from '../../modules/customer/context/CartContext';
import CartModal from '../../modules/customer/components/CartModal';

function CustomerLayout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, singout } = useAuth();
  const { getCartItemsCount } = useCart();
  const [showCartModal, setShowCartModal] = useState(false);

  const handleLogout = () => {
    singout();
    navigate('/');
  };

  const cartCount = getCartItemsCount();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-gray-800">
                <span className="inline-block transform rotate-90">⚊⚊</span>
              </div>
            </Link>

            {/* Navegación */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Productos
              </Link>
              <button
                onClick={() => navigate('/cart')}
                className="text-gray-700 hover:text-gray-900 font-medium relative"
              >
                Carrito de compras
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Botones de autenticación */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700 text-sm hidden md:block">
                    Hola, {user?.name || user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition text-sm font-medium"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition text-sm font-medium"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition text-sm font-medium"
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main>
        <Outlet />
      </main>

      {/* Cart Modal */}
      <CartModal isOpen={showCartModal} onClose={() => setShowCartModal(false)} />
    </div>
  );
}

export default CustomerLayout;