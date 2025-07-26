import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import authService from '../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  updateCurrentUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.info('Logged out successfully!');
    navigate('/login');
  }, [navigate]);

  const setAuthUser = useCallback((user) => {
    setCurrentUser(user);
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      let userFromStorage = authService.getCurrentUser();

      if (userFromStorage && userFromStorage.token) {
        try {
          const freshUser = await authService.fetchCurrentUser();
          if (freshUser) {
            setAuthUser(freshUser);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Error fetching current user during initialization:", error);
          logout();
        }
      } else {
        setAuthUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, [logout, setAuthUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await authService.login(email, password);
      setAuthUser(user);
      toast.success('Login successful!');
      return user;
    } catch (error) {
      setCurrentUser(null);
      delete axios.defaults.headers.common['Authorization'];
      const errorMessage = error.response?.data?.error || error.message || 'Login failed.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentUser = (updatedUserData) => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      const newUser = { ...storedUser, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(newUser));
      setCurrentUser(newUser);
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    updateCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
