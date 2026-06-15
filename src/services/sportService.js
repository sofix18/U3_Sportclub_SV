import axios from 'axios';

const API_URL = 'http://localhost:3000/api/sport';

// Función auxiliar para configurar el token de forma automática
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Recupera el token guardado al iniciar sesión
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

export const sportService = {
  // Obtener todos los deportes
  getAll: async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  },

  // Crear un deporte
  create: async (data) => {
    const response = await axios.post(API_URL, data, getAuthHeaders());
    return response.data;
  },

  // Actualizar un deporte
  update: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
    return response.data;
  },

  // Cambiar el estado (Switch activar/desactivar)
  updateStatus: async (id, status) => {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status }, getAuthHeaders());
    return response.data;
  },

  // Eliminar un deporte
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  }
};