import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Swal from 'sweetalert2';

function MyOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyOrders();
  }, []);

  const loadMyOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'No autorizado',
          text: 'Debes iniciar sesión para ver tus órdenes'
        });
        navigate('/login');
        return;
      }

      const response = await fetch('/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar órdenes');
      }

      const data = await response.json();
      setOrders(data || []);

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar tus órdenes',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Cargando órdenes...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Mis Órdenes</h1>
        <Button onClick={() => navigate('/')}>
          Volver a Productos
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No tienes órdenes aún</p>
            <Button onClick={() => navigate('/')}>
              Empezar a Comprar
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Orden #{order.id.substring(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Fecha: {new Date(order.createdAt).toLocaleDateString('es-AR')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Estado: <span className="font-medium text-purple-600">{order.status}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${order.totalPrice?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>

              {/* Items de la orden */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-2">Productos:</h4>
                <div className="space-y-2">
                  {order.orderItems?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product?.name || 'Producto'} x {item.quantity}
                      </span>
                      <span className="text-gray-800 font-medium">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direcciones */}
              <div className="border-t pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Dirección de Envío:</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Dirección de Facturación:</p>
                  <p className="text-sm text-gray-600">{order.billingAddress}</p>
                </div>
              </div>

              {order.notes && (
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-gray-700">Notas:</p>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;