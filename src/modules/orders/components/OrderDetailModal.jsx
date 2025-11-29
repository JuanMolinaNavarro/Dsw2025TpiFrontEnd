import { useState, useEffect } from 'react';
import { getOrderById } from '../services/orderService';

/**
 * Componente OrderDetailModal
 * Modal que muestra el detalle completo de una orden con sus productos
 * 
 * @component
 * @param {object} order - Datos de la orden a mostrar
 * @param {function} onClose - Función para cerrar el modal
 * @returns {JSX.Element} Modal con detalle de la orden
 */
function OrderDetailModal({ order, onClose }) {
  // Estado para almacenar los productos de la orden
  const [orderItems, setOrderItems] = useState([]);
  
  // Estado para el total de la orden
  const [total, setTotal] = useState(0);
  
  // Estado para los detalles completos de la orden
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Estado de carga
  const [loading, setLoading] = useState(false);

  /**
   * Efecto que se ejecuta cuando se carga el modal
   * Obtiene los detalles completos de la orden desde el backend
   */
  useEffect(() => {
    if (order && order.id) {
      loadOrderDetails();
    }
  }, [order]);

  /**
   * Carga los detalles completos de la orden desde el backend
   */
  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      
      // Obtenemos los detalles completos de la orden
      const { data, error } = await getOrderById(order.id);
      
      if (error) {
        console.error('Error al cargar detalles:', error);
        // Si hay error, usamos los datos básicos de la orden
        processOrderData(order);
        return;
      }

      // Procesamos los datos completos
      processOrderData(data);
      setOrderDetails(data);
    } catch (err) {
      console.error('Error inesperado:', err);
      processOrderData(order);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Procesa los datos de la orden para extraer items y totales
   */
  const processOrderData = (orderData) => {
    if (!orderData) return;

    // Intentamos obtener los items de la orden
    const items = orderData.orderItems || orderData.OrderItems || orderData.items || [];
    setOrderItems(items);
    
    // Calculamos el total basado en los items si están disponibles
    if (items && items.length > 0) {
      const calculatedTotal = items.reduce((sum, item) => {
        const price = item.unitPrice || item.UnitPrice || 0;
        const quantity = item.quantity || item.Quantity || 0;
        return sum + (price * quantity);
      }, 0);
      setTotal(calculatedTotal);
    } else {
      // Si no hay items, usamos el totalAmount de la orden
      setTotal(orderData.totalAmount || orderData.TotalAmount || 0);
    }
  };

  /**
   * Formatea una fecha a formato legible
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Fecha no disponible';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  /**
   * Retorna el texto del estado en español
   * @param {string} status - Estado en inglés
   * @returns {string} Estado en español
   */
  const getStatusLabel = (status) => {
    const statusMap = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      enviado: 'Enviado',
      delivered: 'Entregado',
      entregado: 'Entregado',
      cancelled: 'Cancelado',
      cancelado: 'Cancelado',
    };
    return statusMap[status?.toLowerCase()] || status || 'Desconocido';
  };

  /**
   * Retorna el color de fondo según el estado de la orden
   * @param {string} status - Estado de la orden
   * @returns {string} Clase de Tailwind para el color de fondo
   */
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-950 border border-yellow-200 text-yellow-200';
      case 'confirmed':
      case 'enviado':
        return 'bg-blue-950 border border-blue-200 text-blue-200';
      case 'delivered':
      case 'entregado':
        return 'bg-green-950 border border-green-200 text-green-200';
      case 'cancelled':
      case 'cancelado':
        return 'bg-red-950 border border-red-200 text-red-200';
      default:
        return 'bg-gray-950 border border-gray-200 text-gray-200';
    }
  };

  return (
    <>
      {/* Fondo con efecto blur */}
      <div 
        className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 rounded-lg shadow-s max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          
          {/* Header del modal */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-zinc-900">
            <div>
              <h2 className="text-2xl font-bold text-zinc-50">
                Detalle de Orden
              </h2>
              <p className="text-sm text-zinc-200 mt-1">
                Orden #{order.id?.substring(0, 8) || 'N/A'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-zinc-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Contenido del modal */}
          <div className="p-6 space-y-6">
            
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin mb-4">
                  <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
                </div>
                <p className="text-zinc-200">Cargando detalles de la orden...</p>
              </div>
            )}

            {!loading && (
              <>
            
            {/* Información general de la orden */}
            <div className="bg-zinc-900 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                {/* Fecha */}
                <div>
                  <p className="text-sm text-zinc-200 font-semibold">Fecha de Orden</p>
                  <p className="text-zinc-50 mt-1">
                    {formatDate(order.date)}
                  </p>
                </div>

                {/* Estado */}
                <div>
                  <p className="text-sm text-zinc-200 font-semibold">Estado</p>
                  <div className="mt-1">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                {/* Cliente */}
                <div>
                  <p className="text-sm text-zinc-200 font-semibold">Cliente</p>
                  <p className="text-zinc-50 mt-1">
                    {order.customerName}
                  </p>
                </div>

                {/* Total */}
                <div>
                  <p className="text-sm text-zinc-200 font-semibold">Total</p>
                  <p className="text-zinc-50 font-semibold text-2xl mt-1">
                    ${(order.totalAmount || total).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Productos en la orden */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-50 mb-4">Productos</h3>
              
              {orderItems && orderItems.length > 0 ? (
                <div className="space-y-3">
                  {/* Encabezado de tabla */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-zinc-900 rounded-lg font-semibold text-sm text-zinc-200">
                    <div className="col-span-6">Producto</div>
                    <div className="col-span-2 text-center">Cantidad</div>
                    <div className="col-span-2 text-right">Precio Unit.</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>

                  {/* Items de la orden */}
                  {orderItems.map((item, index) => {
                    const unitPrice = item.unitPrice || item.UnitPrice || 0;
                    const quantity = item.quantity || item.Quantity || 0;
                    const subtotal = unitPrice * quantity;

                    return (
                      <div key={index} className="grid grid-cols-12 gap-4 px-4 py-3 border border-gray-200 rounded-lg transition">
                        {/* Nombre del producto */}
                        <div className="col-span-6">
                          <p className="text-zinc-50 font-medium">
                            {item.productName || item.ProductName || `Producto ${index + 1}`}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {item.productId || item.ProductId || 'N/A'}
                          </p>
                        </div>

                        {/* Cantidad */}
                        <div className="col-span-2 text-center">
                          <p className="text-zinc-50 font-semibold">
                            {quantity}
                          </p>
                        </div>

                        {/* Precio unitario */}
                        <div className="col-span-2 text-right">
                          <p className="text-zinc-50">
                            ${unitPrice.toFixed(2)}
                          </p>
                        </div>

                        {/* Subtotal */}
                        <div className="col-span-2 text-right">
                          <p className="text-zinc-50 font-semibold">
                            ${subtotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Total */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-zinc-900  rounded-lg font-semibold">
                    <div className="col-span-8 text-right text-zinc-50">
                      TOTAL:
                    </div>
                    <div className="col-span-4 text-right text-zinc-50 text-lg">
                      ${(order.totalAmount || total).toFixed(2)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-900 rounded-lg p-6 text-center">
                  <p className="text-zinc-200">
                    No hay información de productos disponible
                  </p>
                </div>
              )}
            </div>

            {/* Información de envío y facturación */}
            {(order.shippingAddress || order.ShippingAddress || order.billingAddress || order.BillingAddress) && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-zinc-50 mb-4">Información de Envío</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(order.shippingAddress || order.ShippingAddress) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-zinc-200 font-semibold mb-2">Dirección de Envío</p>
                      <p className="text-zinc-50 text-sm">
                        {order.shippingAddress || order.ShippingAddress}
                      </p>
                    </div>
                  )}
                  {(order.billingAddress || order.BillingAddress) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-zinc-200 font-semibold mb-2">Dirección de Facturación</p>
                      <p className="text-zinc-50 text-sm">
                        {order.billingAddress || order.BillingAddress}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notas */}
            {(order.notes || order.Notes) && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-zinc-50 mb-4">Notas</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-zinc-50 text-sm">
                    {order.notes || order.Notes}
                  </p>
                </div>
              </div>
            )}
              </>
            )}
          </div>

          {/* Footer del modal */}
          <div className="px-6 py-4 flex justify-end bg-zinc-900">
            <button
              onClick={onClose}
              className="shadow-s rounded-xl p-4 bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetailModal;
