import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import { useCart } from '../../customer/context/CartContext';
import LoginModal from '../../auth/components/LoginModal';
import RegisterModal from '../../auth/components/RegisterModal';

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, role, username, singout } = useAuth();
  const { getCartItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLogout = () => {
    singout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-xl sm:text-2xl font-bold text-gray-800">DSW Tienda</span>
          </Link>
          
          {/* Botón para móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          {/* Menú desktop */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* Solo mostrar carrito si no está autenticado o si es cliente */}
            {(!isAuthenticated || role === 'Cliente') && (
              <Link to="/cart" className="hover:text-purple-600 transition text-sm lg:text-base text-gray-700 font-medium">
                🛒 ({getCartItemsCount()})
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                

                {role === 'Administrador' && (
                  <Link to="/admin" className="hover:text-purple-600 transition text-sm lg:text-base text-gray-700 font-medium">
                    Panel Admin
                  </Link>
                )}
                
                <div className="flex items-center gap-2 lg:gap-3 border-l border-gray-300 pl-3 lg:pl-6 ml-2 lg:ml-4">
                  <div className="text-right hidden lg:block">
                    <div className="text-sm font-semibold text-gray-800">{username}</div>
                    <div className="text-xs text-gray-500">{role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs lg:text-sm font-medium px-3 lg:px-4 py-2 rounded-lg transition-colors"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs lg:text-sm font-medium px-4 lg:px-5 py-2 rounded-lg transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs lg:text-sm font-medium px-4 lg:px-5 py-2 rounded-lg transition-colors"
                >
                  Registrarse
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-3">
              {(!isAuthenticated || role === 'Cliente') && (
                <Link 
                  to="/cart" 
                  className="hover:text-purple-600 transition py-2 text-gray-700 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🛒 Carrito ({getCartItemsCount()})
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  

                  {role === 'Administrador' && (
                    <Link 
                      to="/admin" 
                      className="hover:text-purple-600 transition py-2 text-gray-700 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Panel Admin
                    </Link>
                  )}
                  
                  <div className="border-t border-gray-200 pt-3 mt-2">
                    <div className="text-sm font-semibold mb-1 text-gray-800">{username}</div>
                    <div className="text-xs text-gray-500 mb-3">{role}</div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors text-center"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => {
                      setShowRegisterModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors text-center"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </header>
  );
}

export default Header;
