import { instance } from '../../shared/api/axiosInstance';

export const register = async (formData) => {
  // Dejar que axios lance en caso de error para que el componente lo capture
  const response = await instance.post('api/auth/register', {
    userName: formData.username,
    email: formData.email,
    password: formData.password,
    displayName: formData.displayName,
    role: formData.role,
  });

  return response.data;
};
