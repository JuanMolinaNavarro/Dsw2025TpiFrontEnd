import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { getProducts } from '../services/list';
import { deleteProduct, enableProduct } from '../services/delete';
import EditProductModal from '../components/EditProductModal';

const productStatus = {
  ALL: 'all',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
};

function ListProductsPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(productStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para el modal de edición
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Estado para confirmación de eliminación
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Cargar productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await getProducts(searchTerm, status, pageNumber, pageSize);

      if (fetchError) {
        setError(fetchError);
        return;
      }

      setTotal(data.total);
      setProducts(data.productItems || []);
    } catch (error) {
      setError('Error al cargar los productos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar cuando cambia la paginación o estado
  useEffect(() => {
    fetchProducts();
  }, [status, pageSize, pageNumber]);

  const totalPages = Math.ceil(total / pageSize);

  // Manejar búsqueda
  const handleSearch = async () => {
    setPageNumber(1);
    await fetchProducts();
  };

  // Manejar Enter en búsqueda
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Manejar edición
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // Manejar eliminación
  const handleDeleteClick = async (id) => {
    if (deletingId === id) {
      // Confirmar eliminación
      try {
        setDeleteLoading(true);
        const { error: deleteError } = await deleteProduct(id);

        if (deleteError) {
          setError(deleteError);
          return;
        }

        // Actualizar lista
        await fetchProducts();
        setDeletingId(null);
      } finally {
        setDeleteLoading(false);
      }
    } else {
      // Mostrar confirmación
      setDeletingId(id);
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setDeletingId(null);
  };

  return (
    <div>
      {/* Encabezado y filtros */}
      <Card>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>Productos</h1>
          <Button
            className='hidden sm:block'
            onClick={() => navigate('/admin/products/create')}
          >
            + Crear Producto
          </Button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex items-center gap-2 flex-1'>
            <input
              value={searchTerm}
              onChange={(evt) => setSearchTerm(evt.target.value)}
              onKeyDown={handleSearchKeyDown}
              type="text"
              placeholder='Buscar por nombre o SKU...'
              className='flex-1 px-4 py-2 border border-gray-300 rounded font-medium'
            />
            <Button className='px-4 py-2' onClick={handleSearch}>
              🔍 Buscar
            </Button>
          </div>

          {/* Filtro de estado */}
          <select
            value={status}
            onChange={(evt) => {
              setStatus(evt.target.value);
              setPageNumber(1);
            }}
            className='px-4 py-2 border border-gray-300 rounded font-medium'
          >
            <option value={productStatus.ALL}>Todos</option>
            <option value={productStatus.ENABLED}>Habilitados</option>
            <option value={productStatus.DISABLED}>Inhabilitados</option>
          </select>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className='mt-4 p-3 bg-red-100 text-red-800 rounded'>
            {error}
          </div>
        )}
      </Card>

      {/* Lista de productos */}
      <Card className='mt-4'>
        {loading ? (
          <div className='flex justify-center items-center py-8'>
            <span className='text-lg'>Cargando productos...</span>
          </div>
        ) : products.length === 0 ? (
          <div className='py-8 text-center'>
            <p className='text-gray-500 text-lg'>No hay productos que mostrar</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='bg-gray-100 border-b-2'>
                  <th className='px-4 py-3 text-left font-semibold'>SKU</th>
                  <th className='px-4 py-3 text-left font-semibold'>Nombre</th>
                  <th className='px-4 py-3 text-right font-semibold'>Precio</th>
                  <th className='px-4 py-3 text-center font-semibold'>Stock</th>
                  <th className='px-4 py-3 text-center font-semibold'>Estado</th>
                  <th className='px-4 py-3 text-center font-semibold'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className='border-b hover:bg-gray-50'>
                    <td className='px-4 py-3 font-mono text-sm text-gray-600'>{product.sku}</td>
                    <td className='px-4 py-3 font-medium'>{product.name}</td>
                    <td className='px-4 py-3 text-right font-semibold'>
                      ${product.currentUnitPrice?.toFixed(2) || '0.00'}
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          product.stockQuantity > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stockQuantity > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          product.isActive
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <button
                        onClick={() => handleEditClick(product)}
                        className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition mr-2'
                      >
                        ✏️ Editar
                      </button>
                      {deletingId === product.id ? (
                        <div className='inline-flex gap-1'>
                          <button
                            onClick={() => handleDeleteClick(product.id)}
                            disabled={deleteLoading}
                            className='bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium transition disabled:bg-red-400'
                          >
                            {deleteLoading ? '...' : 'Confirmar'}
                          </button>
                          <button
                            onClick={handleCancelDelete}
                            disabled={deleteLoading}
                            className='bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium transition disabled:bg-gray-300'
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition'
                        >
                          🗑️ Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Paginación */}
      {products.length > 0 && (
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
      )}

      {/* Modal de edición */}
      {showEditModal && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
}

export default ListProductsPage;
