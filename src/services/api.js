import axios from 'axios';

// Configure the base URL for API requests
// In production, this would point to your deployed backend
// For local development, use your local server
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
const ApiService = {
  // Get paste by ID or custom URL
  async getPaste(id) {
    try {
      console.log('Fetching paste:', id); // Debug log
      const response = await api.get(`/pastes/${id}`);
      console.log('Received paste:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Create a new paste
  async createPaste(pasteData) {
    try {
      console.log('Creating paste:', pasteData); // Debug log
      const response = await api.post('/pastes', pasteData);
      console.log('Created paste:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
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