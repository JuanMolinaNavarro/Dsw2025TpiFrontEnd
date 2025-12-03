import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button.jsx';
import Card from '../../shared/components/Card.jsx';
import { getOrders } from '../services/listServices.js';

const orderStatus = {
  ALL: '',
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

function ListOrdersPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(orderStatus.ALL);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await getOrders(searchTerm, status, pageNumber, pageSize);

      if (!response?.data) {
        console.error("No hay data desde la API");
        return;
      }

      setOrders(response.data.items || []);
      setTotalCount(response.data.totalCount || 0);
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, pageSize, pageNumber]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = async () => {
    setPageNumber(1);
    await fetchOrders();
  };

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl">Ordenes</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 flex-1">
            <input
              value={searchTerm}
              onChange={(evt) => setSearchTerm(evt.target.value)}
              type="text"
              placeholder="Buscar"
              className="text-[1.3rem] w-full p-2 border rounded"
            />
            <Button className="h-11 w-11" onClick={handleSearch}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>

          <select
            onChange={(evt) => setStatus(evt.target.value)}
            value={status}
            className="text-[1.3rem] p-2 border rounded"
          >
            <option value={orderStatus.ALL}>Todos los estados</option>
            <option value={orderStatus.PENDING}>Pendiente</option>
            <option value={orderStatus.PROCESSING}>Procesando</option>
            <option value={orderStatus.SHIPPED}>Enviado</option>
            <option value={orderStatus.DELIVERED}>Entregado</option>
            <option value={orderStatus.CANCELLED}>Cancelado</option>
          </select>
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-4">
        {loading ? (
          <Card>
            <span>Cargando órdenes...</span>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <span>No se encontraron órdenes</span>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">
                    #{order.id.substring(0, 8)} - {order.customerName || 'Cliente'}
                  </h2>
                  <p className="text-gray-600 mt-1">Estado: {order.status}</p>
                  <p className="text-gray-600">Total: ${order.totalAmount?.toFixed(2)}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(order.date).toLocaleDateString('es-AR')}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:bg-gray-100 disabled:text-gray-400"
        >
          Anterior
        </button>

        <span className="px-4">
          {pageNumber} / {totalPages || 1}
        </span>

        <button
          disabled={pageNumber === totalPages || totalPages === 0}
          onClick={() => setPageNumber(pageNumber + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:bg-gray-100 disabled:text-gray-400"
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={(evt) => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value));
          }}
          className="ml-3 p-2 border rounded"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default ListOrdersPage;
