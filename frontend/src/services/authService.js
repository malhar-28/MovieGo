// src/services/authService.js
import { jwtDecode } from 'jwt-decode';
import api from './api'; // <<<<<<<<<<<<<<<< IMPORT YOUR CONFIGUERED API INSTANCE

// Remove these, as 'api' will handle the base URL
// const BASE_BACKEND_URL = 'http://localhost:5000';
// const API_URL = '/api/user'; // This will be handled by api.baseURL and relative paths

// Remove authHeader, as the api interceptor handles this automatically
// const authHeader = () => {
//   const user = JSON.parse(localStorage.getItem('user'));
//   if (user && user.token) {
//     return { Authorization: 'Bearer ' + user.token };
//   } else {
//     return {};
//   }
// };

const register = async (userData) => {
  const formData = new FormData();
  formData.append('name', userData.name);
  formData.append('email', userData.email);
  formData.append('password', userData.password);
  if (userData.image) {
    formData.append('image', userData.image);
  }

  // Use 'api' instance directly. Path is relative to api.baseURL ('/api')
  const response = await api.post('/user/register', formData, { // <<<<<<<<<<<<<<<< MODIFIED
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const login = async (email, password) => {
  // Use 'api' instance
  const response = await api.post('/user/login', { email, password }); // <<<<<<<<<<<<<<<< MODIFIED

  if (response.data.token) {
    const { token } = response.data;
    let userDataToStore = { token };

    try {
      const decodedToken = jwtDecode(token);
      userDataToStore = {
        ...userDataToStore,
        user_id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        image: null
      };
    } catch (decodeError) {
      console.error("Error decoding JWT token:", decodeError);
      userDataToStore.name = response.data.name || 'User';
      userDataToStore.email = response.data.email || email;
      userDataToStore.image = response.data.image || null;
    }

    localStorage.setItem('user', JSON.stringify(userDataToStore));
    return userDataToStore;
  }
  return null;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      localStorage.removeItem('user');
      return null;
    }
  }
  return null;
};

const fetchCurrentUser = async () => {
  const currentUserData = getCurrentUser();
  if (!currentUserData || !currentUserData.user_id) {
    console.warn("No user ID found in local storage to fetch current user data.");
    return null;
  }
  try {
    // Use 'api' instance, auth is handled by interceptor
     const response = await api.post('/user/get-user', { id: currentUserData.user_id });
    const fetchedUser = response.data;
    
    // Force-update image reference
    const updatedUser = {
      ...currentUserData,
      name: fetchedUser.name,
      email: fetchedUser.email,
      image: fetchedUser.image || null
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error('Error fetching current user data:', error);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      logout();
      window.location.href = '/login';
    }
    return null;
  }
};

// const updateUser = async (formData) => {
//   const response = await api.put('/user/update', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   if (response.data.user) {
//     const current = getCurrentUser();
//     const updatedUser = {
//       ...current,
//       name: response.data.user.name,
//       email: response.data.user.email,
//       image: response.data.user.image ? `${response.data.user.image}?t=${Date.now()}` : null,
//     };
//     localStorage.setItem('user', JSON.stringify(updatedUser));
//     return updatedUser;
//   }
//   return response.data;
// };

// src/services/authService.js
const updateUser = async (formData) => {
  const response = await api.put('/user/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (response.data.user) {
    const current = getCurrentUser();
    const updatedUser = {
      ...current,
      name: response.data.user.name,
      email: response.data.user.email,
      // --- CHANGE THIS LINE ---
      image: response.data.user.image || null, // Store only the filename received from the backend
      // --- END CHANGE ---
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }
  return response.data;
};

const changePassword = async (oldPassword, newPassword) => {
  // Use 'api' instance, auth is handled by interceptor
  const response = await api.put('/user/change-password', { oldPassword, newPassword, update_user: 'true' }); // <<<<<<<<<<<<<<<< MODIFIED
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  fetchCurrentUser,
  updateUser,
  changePassword,
  // Remove BASE_BACKEND_URL from here as it's not used consistently and adds confusion
  // BASE_BACKEND_URL
};

export default authService;