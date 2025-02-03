import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Replace with your backend URL

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/authenticate`, {
        email: email,
        password: password,
      });
      return response.data; // If login is successful, return the success message from backend
    } catch (error) {
      // Log error to console for debugging
      console.error('Login API Error:', error.response || error.message);

      if (error.response) {
        // If the error has a response object, we can check the status code and message
        return Promise.reject({
          status: error.response.status,
          message: error.response.data || 'An error occurred during login.',
        });
      } else {
        // In case there's no response, it's likely a network error
        return Promise.reject({ status: 500, message: error.message });
      }
    }
  },
  registerEmployee: async (employeeData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/addemployee`, employeeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'An error occurred during registration.');
    }
  },
};

export default authService;
