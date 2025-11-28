import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateProduct } from '../services/update';

/**
 * Modal para editar un producto existente
 * @param {object} product - Producto a editar
 * @param {function} onClose - Callback cuando se cierra el modal
 * @param {function} onSuccess - Callback cuando se actualiza correctamente
 */
function EditProductModal({ product, onClose, onSuccess }) {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      sku: product.sku || '',
      name: product.name || '',
      description: product.description || '',
      internalCode: product.internalCode || '',
      currentUnitPrice: product.currentUnitPrice || 0,
      stockQuantity: product.stockQuantity || 0,
      imageUrl: product.imageUrl || '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const skuValue = watch('sku');

  // Manejar envA-o del formulario
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await updateProduct(product.id, data);

      if (updateError) {
        setError(updateError);
        return;
      }

      setSuccess(true);
      
      // Esperar un momento antes de cerrar
      setTimeout(() => {
        reset();
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err) {
      setError('Error al actualizar el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30'>
      <div className='bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Encabezado */}
        <div className='p-6 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold'>Editar Producto</h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 text-2xl'
              aria-label='Cerrar'
            >
              A-
            </button>
          </div>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-4'>
          {/* Mensajes */}
          {error && (
            <div className='p-3 bg-red-100 text-red-800 rounded border border-red-300 text-sm'>
              {error}
            </div>
          )}

          {success && (
            <div className='p-3 bg-green-100 text-green-800 rounded border border-green-300 text-sm'>
              �o" Producto actualizado correctamente
            </div>
          )}

          {/* SKU */}
          <div>
            <label className='block text-sm font-semibold mb-1'>
              SKU* 
              <span className='text-xs text-gray-500 ml-2'>(MAYAsSCULAS, nA�meros y guiones)</span>
            </label>
            <input
              type='text'
              {...register('sku', {
                required: 'SKU es obligatorio',
                minLength: { value: 3, message: 'SKU debe tener al menos 3 caracteres' },
                maxLength: { value: 50, message: 'SKU no puede exceder 50 caracteres' },
                pattern: {
                  value: /^[A-Z0-9\\-]*$/,
                  message: 'SKU solo puede contener MAYAsSCULAS, nA�meros y guiones',
                },
              })}
              onChange={(e) => {
                // Convertir a mayA�sculas automA�ticamente
                e.target.value = e.target.value.toUpperCase();
              }}
              disabled={loading || success}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100'
              placeholder='Ej: PROD-001'
            />
            {errors.sku && <span className='text-red-600 text-sm'>{errors.sku.message}</span>}
            {skuValue && !/^[A-Z0-9\\-]*$/.test(skuValue) && (
              <span className='text-orange-600 text-xs'>�s� Se convertirA� a mayA�sculas al guardar</span>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label className='block text-sm font-semibold mb-1'>Nombre*</label>
            <input
              type='text'
              {...register('name', {
                required: 'Nombre es obligatorio',
                minLength: { value: 3, message: 'Nombre debe tener al menos 3 caracteres' },
                maxLength: { value: 100, message: 'Nombre no puede exceder 100 caracteres' },
              })}
              disabled={loading || success}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100'
              placeholder='Ej: Producto de prueba'
            />
            {errors.name && <span className='text-red-600 text-sm'>{errors.name.message}</span>}
          </div>

          {/* CA3digo Interno */}
          <div>
            <label className='block text-sm font-semibold mb-1'>CA3digo Interno*</label>
            <input
              type='text'
              {...register('internalCode', {
                required: 'CA3digo Interno es obligatorio',
                minLength: { value: 1, message: 'CA3digo Interno es obligatorio' },
                maxLength: { value: 50, message: 'CA3digo Interno no puede exceder 50 caracteres' },
              })}
              disabled={loading || success}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100'
              placeholder='Ej: INT-001'
            />
            {errors.internalCode && <span className='text-red-600 text-sm'>{errors.internalCode.message}</span>}
          </div>

          {/* DescripciA3n */}
          <div>
            <label className='block text-sm font-semibold mb-1'>DescripciA3n</label>
            <textarea
              {...register('description', {
                maxLength: { value: 250, message: 'DescripciA3n no puede exceder 250 caracteres' },
              })}
              disabled={loading || success}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100'
              placeholder='DescripciA3n del producto'
              rows='3'
            />
            {errors.description && <span className='text-red-600 text-sm'>{errors.description.message}</span>}
          </div>

          {/* URL de imagen */}
          <div>
            <label className='block text-sm font-semibold mb-1'>URL de imagen</label>
            <input
              type='url'
              {...register('imageUrl', {
                maxLength: { value: 500, message: 'La URL es demasiado larga' },
              })}
              disabled={loading || success}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100'
              placeholder='https://...'
            />
            {errors.imageUrl && <span className='text-red-600 text-sm'>{errors.imageUrl.message}</span>}
          </div>

          {/* Precio */}
          <div>
            <label className='block text-sm font-semibold mb-1'>Precio*</label>
            <input
              type='number'
              step='0.01'
              {...register('currentUnitPrice', {
                required: 'Precio es obligatorio',
                min: { value: 0.01, message: 'Precio debe ser mayor a 0' },
              })}
              disabled={loading || success}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100'
              placeholder='Ej: 99.99'
            />
            {errors.currentUnitPrice && <span className='text-red-600 text-sm'>{errors.currentUnitPrice.message}</span>}
          </div>

          {/* Stock */}
          <div>
            <label className='block text-sm font-semibold mb-1'>Stock*</label>
            <input
              type='number'
              {...register('stockQuantity', {
                required: 'Stock es obligatorio',
                min: { value: 0, message: 'Stock no puede ser negativo' },
              })}
              disabled={loading || success}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100'
              placeholder='Ej: 100'
            />
            {errors.stockQuantity && <span className='text-red-600 text-sm'>{errors.stockQuantity.message}</span>}
          </div>

          {/* Botones */}
          <div className='flex gap-2 pt-4'>
            <button
              type='button'
              onClick={onClose}
              disabled={loading}
              className='flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 rounded font-semibold transition'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={loading || success}
              className='flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded font-semibold transition'
            >
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;

