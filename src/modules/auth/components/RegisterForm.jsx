import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import { register as registerUser } from '../services/register';
import { useState } from 'react';

function RegisterForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const navigate = useNavigate();
  const password = watch('password');

  const onValid = async (formData) => {
    try {
      setErrorBackendMessage('');
      await registerUser(formData);

      // Redirigir a login si el registro es exitoso
      navigate('/login');
    } catch (error) {
      if (error.response?.data?.code) {
        setErrorBackendMessage(error.response.data.message || 'Error al registrar');
      } else {
        setErrorBackendMessage('Contactar a Soporte');
      }
    }
  };

  return (
    <form
      className='
        flex
        flex-col
        gap-4
        p-8
        bg-white
        rounded-lg
        shadow-md
        w-full
        max-w-md
      '
      onSubmit={handleSubmit(onValid)}
    >
      <h2 className='text-2xl font-bold mb-4'>Registrar Usuario</h2>

      <Input
        label='Usuario'
        error={errors.username?.message}
        {...register('username', {
          required: 'Usuario es requerido',
        })}
      />

      <Input
        label='Email'
        type='email'
        error={errors.email?.message}
        {...register('email', {
          required: 'Email es requerido',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email no válido',
          },
        })}
      />

      <div>
        <label className='block text-sm font-medium mb-1'>Rol</label>
        <select
          {...register('role', {
            required: 'Selecciona una opción',
          })}
          className='w-full border border-gray-200 rounded-md p-1.5 hover:shadow'
        >
          <option value=''>Selecciona una opción</option>
          <option value='Administrador'>Administrador</option>
          <option value='Cliente'>Cliente</option>
        </select>
        {errors.role?.message && (
          <span className='text-red-500 text-sm'>{errors.role.message}</span>
        )}
      </div>

      <Input
        label='Contraseña'
        type='password'
        error={errors.password?.message}
        {...register('password', {
          required: 'Contraseña es requerida',
          minLength: {
            value: 6,
            message: 'Mínimo 6 caracteres',
          },
        })}
      />

      <Input
        label='Confirmar Contraseña'
        type='password'
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Confirma tu contraseña',
          validate: (value) => value === password || 'Las contraseñas no coinciden',
        })}
      />

      <Button type='submit' className='w-full mt-4'>
        Registrar Usuario
      </Button>

      <button
        type='button'
        onClick={() => navigate('/login')}
        className='text-center text-purple-600 hover:underline mt-2'
      >
        ¿Ya tienes cuenta? Inicia Sesión
      </button>

      {errorBackendMessage && (
        <span className='text-red-500 text-center'>{errorBackendMessage}</span>
      )}
    </form>
  );
}

export default RegisterForm;
