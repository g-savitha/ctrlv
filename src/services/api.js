import axios from 'axios';

// Configure the base URL for API requests
// In production, this would point to your deployed backend
// For local development, use your local server
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-api-url.com/api'
  : 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const ApiService = {
  // Get paste by ID or custom URL
  getPaste: async (id) => {
    try {
      const response = await api.get(`/pastes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching paste:', error);
      throw error;
    }
  },
  
  // Create a new paste
  createPaste: async (pasteData) => {
    try {
      const response = await api.post('/pastes', pasteData);
      return response.data;
    } catch (error) {
      console.error('Error creating paste:', error);
      throw error;
    }
  },
  
  // Delete a paste (if needed)
  deletePaste: async (id) => {
    try {
      await api.delete(`/pastes/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting paste:', error);
      throw error;
    }
  }
};

export default ApiService;