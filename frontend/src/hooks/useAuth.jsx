import { useState, useContext, createContext, useEffect } from 'react';
import ApiService from '../services/api/AuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token')); // Consistent naming
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    if (token) {
      checkAuthStatus();
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const userData = await ApiService.getUserProfile(token);
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, userType) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (userType === 'customer') {
        response = await ApiService.registerCustomer(userData);
      } else {
        response = await ApiService.registerPharmacy(userData);
      }

      // For customer registration, auto-login if token is returned
      if (userType === 'customer' && response.token) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
      }

      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ApiService.login(credentials);
      
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
      }

      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    checkAuthStatus,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};