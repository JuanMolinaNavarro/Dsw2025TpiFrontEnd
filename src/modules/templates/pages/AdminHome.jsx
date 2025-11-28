import { useState, useEffect } from 'react';
import { instance } from '../../shared/api/axiosInstance';

/**
 * Página Principal del Panel Administrativo
 * Muestra estadísticas generales: cantidad de productos y órdenes
 * 
 * @component
 * @returns {JSX.Element} Página de inicio del admin
 */
function AdminHome() {
  // Estado para almacenar las estadísticas
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    loading: true,
  });

  /**
   * Efecto que se ejecuta al cargar la página
   * Obtiene las estadísticas del backend
   */
  useEffect(() => {
    loadStatistics();
  }, []);

  /**
   * Carga las estadísticas desde el backend
   */
  const loadStatistics = async () => {
    try {
      // Obtener cantidad de productos usando el endpoint admin
      // que devuelve todos los productos (activos e inactivos)
      const productsResponse = await instance.get('api/products/admin', {
        params: {
          pageSize: 1,
          pageNumber: 1,
        },
      });
      const productsCount = productsResponse.data.totalCount || 0;

      // Obtener cantidad de órdenes
      const ordersResponse = await instance.get('api/orders/admin', {
        params: {
          pageSize: 1,
          pageNumber: 1,
        },
      });
      const ordersCount = ordersResponse.data.totalCount || 0;

      setStats({
        productsCount,
        ordersCount,
        loading: false,
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenido al panel administrativo. Aquí puedes gestionar productos y órdenes.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card de Productos */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Productos
            </h2>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042L5.960 9H9a2 2 0 100-4H6.77l-.447-1.79A.999.999 0 005 2H3zM15 19c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </div>
          </div>
          
          {stats.loading ? (
            <div className="flex items-center justify-center h-16">
              <div className="animate-spin">
                <div className="h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm mb-2">
                Cantidad de Productos:
              </p>
              <p className="text-4xl font-bold text-blue-600">
                {stats.productsCount}
              </p>
            </>
          )}
        </div>

        {/* Card de Órdenes */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Órdenes
            </h2>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
          </div>
          
          {stats.loading ? (
            <div className="flex items-center justify-center h-16">
              <div className="animate-spin">
                <div className="h-6 w-6 border-4 border-green-600 border-t-transparent rounded-full"></div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm mb-2">
                Cantidad de Órdenes:
              </p>
              <p className="text-4xl font-bold text-green-600">
                {stats.ordersCount}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Accesos Rápidos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/products"
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
          >
            <p className="font-semibold text-gray-900">
              Gestionar Productos
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Ver, crear y editar productos
            </p>
          </a>
          
          <a
            href="/admin/orders"
            className="block p-4 border border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition"
          >
            <p className="font-semibold text-gray-900">
              Gestionar Órdenes
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Ver y actualizar estado de órdenes
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
