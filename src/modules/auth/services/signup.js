import { instance } from '../../shared/api/axiosInstance';

/**
 * Servicio para registrar un nuevo cliente
 * Solo registra clientes, no administradores
 * 
 * @param {string} userName - Nombre de usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @param {string} displayName - Nombre mostrado del usuario
 * @param {string} phoneNumber - Número de teléfono del usuario
 * @returns {Promise<{data: string | null, error: null | object}>} Token JWT si es exitoso, error si falla
 */
export const signup = async (userName, email, password, displayName, phoneNumber) => {
  try {
    // Realizamos una petición POST al endpoint de registro
    // El role siempre es "Cliente" para registros desde el modal
    const response = await instance.post('api/auth/register', {
      userName,
      password,
      email,
      displayName,
      phoneNumber,
      role: 'Cliente',
    });

    // Retornamos el token y null como error
    return { 
      data: response.data.token, 
      error: null 
    };
  } catch (error) {
    // Si hay un error, lo retornamos
    return { 
      data: null, 
      error: error.response?.data || error.message 
    };
  }
};
