import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import { getAllOrders } from '../services/adminOrderService';
import OrderDetailModal from '../components/OrderDetailModal';

function ListOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Cargar órdenes cuando cambia página o tamaño
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await getAllOrders(pageNumber, pageSize);

      if (error) {
        console.error('Error al cargar órdenes:', error);
        return;
      }

      setTotal(data.total);
      setOrders(data.items || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pageNumber, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  // Manejar apertura del modal de detalles
  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setShowDetailModal(true);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>Órdenes</h1>
          <div className='text-sm text-gray-600'>
            Total: {total} órdenes
          </div>
        </div>

        {loading ? (
          <div className='flex justify-center items-center py-8'>
            <span className='text-lg'>Cargando órdenes...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className='py-8 text-center'>
            <p className='text-gray-500'>No hay órdenes registradas</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='bg-gray-100 border-b-2'>
                  <th className='px-4 py-3 text-left font-semibold'>ID Orden</th>
                  <th className='px-4 py-3 text-left font-semibold'>Cliente</th>
                  <th className='px-4 py-3 text-left font-semibold'>Fecha</th>
                  <th className='px-4 py-3 text-right font-semibold'>Total</th>
                  <th className='px-4 py-3 text-center font-semibold'>Estado</th>
                  <th className='px-4 py-3 text-center font-semibold'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className='border-b hover:bg-gray-50'>
                    <td className='px-4 py-3 font-mono text-sm'>#{order.id}</td>
                    <td className='px-4 py-3'>
                      <div className='font-medium'>{order.customerName || 'N/A'}</div>
                      <div className='text-sm text-gray-600'>{order.customerId || 'N/A'}</div>
                    </td>
                    <td className='px-4 py-3'>{formatDate(order.date)}</td>
                    <td className='px-4 py-3 text-right font-semibold'>
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'Completada' || order.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Pendiente' || order.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'Cancelada' || order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status || 'Desconocido'}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition'
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Paginación */}
      <div className='mt-6 flex justify-center items-center gap-4 flex-wrap'>
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className='px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded font-medium'
        >
          ← Anterior
        </button>

        <span className='font-semibold'>
          Página {pageNumber} de {totalPages}
        </span>

        <button
          disabled={pageNumber === totalPages}
          onClick={() => setPageNumber(pageNumber + 1)}
          className='px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded font-medium'
        >
          Siguiente →
        </button>

        <select
          value={pageSize}
          onChange={(evt) => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value));
          }}
          className='px-3 py-2 border border-gray-300 rounded font-medium'
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="15">15 por página</option>
          <option value="20">20 por página</option>
        </select>
      </div>

      {/* Modal de detalles */}
      {showDetailModal && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOrderId(null);
          }}
        />
      )}
    </div>
  );
}

export default ListOrdersPage;
