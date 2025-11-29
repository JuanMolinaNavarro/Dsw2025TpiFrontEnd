import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../../auth/components/AuthModal';

/**
 * Componente Header principal de la aplicación
 * Contiene: Logo, navegación, buscador y botones de autenticación
 * 
 * @component
 * @param {function} onSearch - Callback que se ejecuta cuando el usuario busca
 * @returns {JSX.Element} Header con navegación completa
 */
function Header({ onSearch }) {
  // Estado para controlar si el modal de autenticación está abierto
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Estado para controlar si mostrar login o signup en el modal
  const [authMode, setAuthMode] = useState('login'); // 'login' o 'signup'
  
  // Estado para controlar el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hook para navegar entre páginas
  const navigate = useNavigate();
  
  // Obtenemos el token del localStorage para saber si el usuario está autenticado
  const token = localStorage.getItem('token');
  
  // Obtenemos el rol del usuario del localStorage
  const userRole = localStorage.getItem('role');

  /**
   * Maneja el evento de búsqueda cuando el usuario presiona Enter o hace clic en el botón
   * Llama al callback onSearch con el término de búsqueda
   */
  const handleSearch = (e) => {
    e.preventDefault();
    // Si onSearch existe y está definido, lo ejecutamos pasando el término de búsqueda
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  /**
   * Cierra la sesión del usuario
   * Elimina el token y el rol del localStorage y redirige a la página principal
   */
  const handleLogout = () => {
    // Limpiamos el localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Redirigimos a la página principal
    navigate('/');
    // Recargamos la página para que se actualicen los estados
    window.location.reload();
  };

  /**
   * Navega al panel de administración
   * Solo disponible si el usuario es un administrador
   */
  const handleAdminDashboard = () => {
    navigate('/admin');
  };

  return (
    <>
      {/* Header principal */}
      <header className="shadow-s rounded-xl p-4 bg-zinc-900 text-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo y nombre de la aplicación */}
            <div className="flex items-center gap-8">
              <div className="text-2xl font-bold text-zinc-50">
                <img src="../../../../public/logo.png" alt="Logo" className='h-20'/>
              </div>

              {/* Navegación de enlaces principales */}
              <nav className="hidden md:flex gap-6">
                <a 
                  href="/" 
                  className="text-zinc-50 hover:text-zinc-400 font-medium transition"
                >
                  Productos
                </a>
                <a 
                  href="/cart" 
                  className="text-zinc-50 hover:text-zinc-400 font-medium transition"
                >
                  Carrito de compras
                </a>
                {token && (
                  <a 
                    href="/orders" 
                    className="text-zinc-50 hover:text-zinc-400 font-medium transition"
                  >
                    Mis Ordenes
                  </a>
                )}
              </nav>
            </div>

            {/* Barra de búsqueda */}
            <form 
              onSubmit={handleSearch}
              className="hidden md:flex items-center bg-zinc-900 rounded-lg px-4 py-2 flex-1 max-w-md mx-6 shadow-s"
            >
              <input 
                type="text" 
                placeholder="Search" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none flex-1 text-zinc-200 placeholder-gray-500 border-0"
              />
              <button 
                type="submit"
                className="text-zinc-50 hover:text-zinc-200 ml-2"
              >
                {/* Icono de lupa */}
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>

            {/* Botones de autenticación y perfil */}
            <div className="flex items-center gap-4">
              {!token ? (
                // Si el usuario NO está autenticado, mostramos botones de login y signup
                <>
                  <button 
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="shadow-s rounded-xl p-4 bg-zinc-900 text-white transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    Iniciar Sesión
                  </button>
                  <button 
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                    className="shadow-s rounded-xl p-4 bg-zinc-900 text-white transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    Registrarse
                  </button>
                </>
              ) : (
                // Si el usuario ESTÁ autenticado, mostramos botones de cerrar sesión y panel admin
                <>
                  {/* Mostrar botón de admin solo si el rol es "Admin" */}
                  {userRole === 'Admin' && (
                    <button 
                      onClick={handleAdminDashboard}
                      className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                      Panel Admin
                    </button>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="shadow-s rounded-xl p-4 bg-zinc-900 text-white transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal de autenticación - se muestra solo si showAuthModal es true */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      )}
    </>
  );
}

export default Header;
