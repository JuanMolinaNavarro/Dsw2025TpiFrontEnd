import { useState, useEffect } from 'react';
import { useCart } from '../../customer/context/CartContext';
import { getPublicProducts } from '../services/list';
import Swal from 'sweetalert2';

function ProductListPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    loadProducts();
  }, [currentPage]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await getPublicProducts(
        currentPage,
        12,
        searchTerm
      );

      if (error) {
        console.error('Error al cargar productos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error,
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }

      console.log('Productos cargados:', data.products);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);

      const initialQuantities = {};
      (data.products || []).forEach(product => {
        initialQuantities[product.id] = 0;
      });
      setQuantities(initialQuantities);

    } catch (error) {
      console.error('Error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProducts();
  };

  const increment = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const decrement = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1)
    }));
  };

  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value) || 0;
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, numValue)
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 0;

    if (quantity < 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad inválida',
        text: 'La cantidad mínima es 1',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    addToCart(product, quantity);

    setQuantities(prev => ({
      ...prev,
      [product.id]: 0
    }));

    Swal.fire({
      icon: 'success',
      title: 'Producto agregado',
      text: `${product.name} agregado al carrito`,
      timer: 1500,
      showConfirmButton: false
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de búsqueda */}
      <div className="bg-white border-b border-gray-200 py-6 mb-6">
      <div className="container mx-auto px-4">
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-gray-700 transition font-medium"
        >
          Buscar
        </button>
      </div>
    </form>
  </div>
</div>

      {/* Grid de productos */}
      <div className="container mx-auto px-4 pb-12">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* IMAGEN CON MANEJO DE ERROR */}
                <div className="w-full aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-400 text-5xl">📦</span>';
                      }}
                    />
                  ) : (
                    <span className="text-gray-400 text-5xl">📦</span>
                  )}
                </div>

                {/* Información del producto */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 min-h-[40px]">
                    {product.name || 'Text'}
                  </h3>
                  <p className="text-xl font-bold text-gray-900 mb-4">
                    ${product.currentUnitPrice?.toFixed(2) || '0'}
                  </p>

                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrement(product.id)}
                      className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition text-gray-700 font-medium"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      value={quantities[product.id] || 0}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      className="w-12 h-8 text-center bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-700 font-medium"
                      min="0"
                    />

                    <button
                      onClick={() => increment(product.id)}
                      className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition text-gray-700 font-medium"
                    >
                      +
                    </button>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-sm font-medium"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-gray-700"
            >
              Anterior
            </button>

            <span className="text-gray-700 font-medium px-4">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-gray-700"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;