const API_BASE_URL = '/api/auth';

export const authService = {
  // Método para login
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      
      // Guardar el token en localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Guardar información del usuario
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Método para registro
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Método para logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Método para obtener el usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Método para verificar si hay un usuario autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Método para obtener el token
  getToken: () => {
    return localStorage.getItem('token');
  },
};