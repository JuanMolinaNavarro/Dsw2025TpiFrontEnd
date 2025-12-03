import { useState, useEffect } from 'react';
import Card from '../../shared/components/Card.jsx';
import { getProducts } from '../../products/services/list.js';
import { getOrdersCount } from '../../orders/services/listServices.js';

function Home() {
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtenemos los conteos por separado para identificar cuál falla
      let products = 0;
      let orders = 0;
      
      try {
           
  
          const { data, error } = await getProducts(null, null, 1, 1); //solo necesitamos total
          if (error) throw error;

          setProductsCount(data.total);
         } catch (err) {
          console.error('Error al obtener productos:', err);
          console.error('Detalles del error:', err.response?.data || err.message);
          setError('Error al cargar productos. Verifica que el backend esté corriendo y que estés autenticado.');
         }

      
      try {
        
        orders = await getOrdersCount();
        
        setOrdersCount(orders);
      } catch (err) {
        console.error('Error al obtener órdenes:', err);
        console.error('Detalles del error:', err.response?.data || err.message);
        if (!error) {
          setError('Error al cargar órdenes. Verifica que el backend esté corriendo y que estés autenticado.');
        }
      }
      
    } catch (err) {
      console.error('Error general al cargar estadísticas:', err);
      setError('No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">{error}</p>
        <button
          onClick={loadCounts}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
      <Card>
        <h3 className="text-xl font-bold mb-2">Productos</h3>
        <p className="text-gray-600">
          Cantidad de Productos: <span className="font-semibold">#{productsCount}</span>
        </p>
      </Card>

      <Card>
        <h3 className="text-xl font-bold mb-2">Ordenes</h3>
        <p className="text-gray-600">
          Cantidad de Ordenes: <span className="font-semibold">#{ordersCount}</span>
        </p>
      </Card>
    </div>
  );
}

export default Home;