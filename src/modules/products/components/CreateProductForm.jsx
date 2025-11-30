import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { useState } from 'react';
import { frontendErrorMessage } from '../helpers/backendError';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const navigate = useNavigate();

  const onValid = async (formData) => {
    try {
      setErrorBackendMessage('');
      await createProduct(formData);

      navigate('/admin/products');
    } catch (error) {
      if (error.response?.data?.code) {
        const errorMessage = frontendErrorMessage[error.response.data.code];
        setErrorBackendMessage(errorMessage || error.response.data.message || 'Error al crear el producto');
      } else {
        setErrorBackendMessage('Contactar a Soporte');
      }
    }
  };

  return (
    <Card>
      <form
        className='
          flex
          flex-col
          gap-20
          p-8

          sm:gap-4
        '
        onSubmit={handleSubmit(onValid)}
      >
        <Input
          label='SKU'
          error={errors.sku?.message}
          {...register('sku', {
            required: 'SKU es requerido',
          })}
        />
        <Input
          label='Código Único'
          error={errors.cui?.message}
          {...register('cui', {
            required: 'Código Único es requerido',
          })}
        />
        <Input
          label='Nombre'
          error={errors.name?.message}
          {...register('name', {
            required: 'Nombre es requerido',
          })}
        />
        <Input
          label='Descripción'
          {...register('description')}
        />
        <Input
          label='Precio'
          error={errors.price?.message}
          type='number'
          step='0.01'
          {...register('price', {
            required: 'Precio es requerido',
            min: {
              value: 0,
              message: 'El precio debe ser mayor a 0',
            },
            validate: (value) => value > 0 || 'El precio debe ser mayor a 0',
          })}
        />
        <Input
          label='Stock'
          error={errors.stock?.message}
          type='number'
          {...register('stock', {
            required: 'Stock es requerido',
            min: {
              value: 0,
              message: 'El stock no puede ser negativo',
            },
            validate: (value) => value >= 0 || 'El stock no puede ser negativo',
          })}
        />
        <div className='sm:text-end'>
          <Button type='submit' className='w-full sm:w-fit'>Crear Producto</Button>
        </div>
        {errorBackendMessage && <span className='text-red-500'>{errorBackendMessage}</span>}
      </form>
    </Card>
  );
};

export default CreateProductForm;
