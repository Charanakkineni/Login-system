import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

class AuthService {
  // Register user
  async register(name, email, password) {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });

    if (response.data.success && response.data.data.token) {
      this.setUserData(response.data.data);
    }

    return response.data;
  }

  // Login user
  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    if (response.data.success && response.data.data.token) {
      this.setUserData(response.data.data);
    }

    return response.data;
  }

  // Logout user
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // Get user profile
  async getProfile() {
    const token = this.getToken();
    
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  // Set user data in localStorage
  setUserData(data) {
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();