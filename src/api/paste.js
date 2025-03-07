import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const createPaste = async (pasteData) => {
  try {
    console.log('Sending paste data:', pasteData);
    const response = await axios.post(`${API_URL}/pastes`, pasteData);
    console.log('Received response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getPaste = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/pastes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 