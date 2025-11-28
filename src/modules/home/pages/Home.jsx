import { useState, useEffect } from 'react';
import Header from '../../shared/components/Header';
import { getPublicProducts } from '../services/publicList';
import ProductCard from '../../products/components/ProductCard';

/**
 * Página principal (Home) - Listado de productos para clientes
 * 
 * Esta página muestra:
 * - Header con navegación y búsqueda
 * - Grid de productos con paginación
 * - Controles de búsqueda y paginación
 * 
 * @component
 * @returns {JSX.Element} Página principal con listado de productos
 */
function Home() {
  // Estado para almacenar los productos obtenidos del backend
  const [products, setProducts] = useState([]);
  
  // Estado para el término de búsqueda actual
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para la página actual de paginación
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estado para el total de páginas disponibles
  const [totalPages, setTotalPages] = useState(1);
  
  // Estado para el total de productos encontrados
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Estado para mostrar un indicador de carga
  const [loading, setLoading] = useState(false);
  
  // Estado para mostrar mensajes de error
  const [error, setError] = useState(null);

  // Cantidad de productos por página
  const pageSize = 6;

  /**
   * Efecto que se ejecuta cuando cambia la página o el término de búsqueda
   * Realiza una llamada al backend para obtener los productos
   */
  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  /**
   * Obtiene los productos del backend usando el servicio publicList
   * Maneja el estado de carga y errores
   */
  const fetchProducts = async () => {
    try {
      // Mostramos el indicador de carga
      setLoading(true);
      // Limpiamos el error anterior (si existe)
      setError(null);

      // Llamamos al servicio para obtener los productos
      const { data, error: fetchError } = await getPublicProducts(
        searchTerm,
        currentPage,
        pageSize
      );

      // Si hay un error, lo mostramos
      if (fetchError) {
        setError('No se pudieron cargar los productos. Intenta nuevamente.');
        console.error('Error:', fetchError);
        return;
      }

      // Actualizamos el estado con los datos obtenidos
      if (data) {
        // Los datos contienen items (productos) y totalPages
        setProducts(data.items || []);
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.total || 0);
      }
    } catch (err) {
      // Capturamos cualquier error no esperado
      setError('Error inesperado al cargar productos');
      console.error('Unexpected error:', err);
    } finally {
      // Apagamos el indicador de carga
      setLoading(false);
    }
  };

  /**
   * Maneja la búsqueda de productos
   * Resetea la página a 1 y busca con el término ingresado
   */
  const handleSearch = (searchValue) => {
    // Actualizamos el término de búsqueda
    setSearchTerm(searchValue);
    // Volvemos a la página 1 para mostrar los resultados desde el principio
    setCurrentPage(1);
  };

  /**
   * Maneja el clic en el botón de página anterior
   */
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  /**
   * Maneja el clic en el botón de página siguiente
   */
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con búsqueda */}
      <Header onSearch={handleSearch} />

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Título y información de búsqueda */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Productos
          </h1>
          {searchTerm && (
            <p className="text-gray-600">
              Resultados para "{searchTerm}" ({totalProducts} encontrados)
            </p>
          )}
        </div>

        {/* Sección de productos */}
        {error && (
          // Mostrar error si ocurre uno
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          // Mostrar indicador de carga
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="text-gray-600 mt-4">Cargando productos...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          // Mostrar mensaje si no hay productos
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No se encontraron productos con esa búsqueda' : 'No hay productos disponibles'}
            </p>
          </div>
        ) : (
          // Grid de productos
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                />
              ))}
            </div>

            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                {/* Botón anterior */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg
                             hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  ← Anterior
                </button>

                {/* Información de paginación */}
                <span className="text-gray-700 font-medium">
                  Página <span className="font-bold">{currentPage}</span> de <span className="font-bold">{totalPages}</span>
                </span>

                {/* Botón siguiente */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg
                             hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
