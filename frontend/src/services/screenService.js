// src/services/screenService.js
import api from './api'; // IMPORT YOUR CONFIGURED API INSTANCE

const getScreenById = async (screenId) => {
  try {
    const response = await api.post('/screen/get', { id: screenId });
    return response.data;
  } catch (error) {
    console.error('Error fetching screen by ID:', error);
    throw error;
  }
};

const getSeatsByScreenId = async (screenId) => {
  try {
    const response = await api.post('/seats/get-by-screen', { screen_id: screenId });
    return response.data;
  } catch (error) {
    console.error('Error fetching seats by screen ID:', error);
    throw error;
  }
};

// >>>>>>>>>>>>>>>>>>>>>> ADD THIS NEW FUNCTION <<<<<<<<<<<<<<<<<<<<<<<
const getAllScreens = async () => {
  try {
    // As per your backend screenRoutes.js: router.get('/get-all', verifyAuth, screenController.getAllScreens);
    const response = await api.get('/screen/get-all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all screens:', error);
    throw error;
  }
};
// >>>>>>>>>>>>>>>>>>>>>> END NEW FUNCTION <<<<<<<<<<<<<<<<<<<<<<<


const screenService = {
  getScreenById,
  getSeatsByScreenId,
  getAllScreens, // >>>>>>>>>>>>>>>>>>>>>> EXPORT THE NEW FUNCTION <<<<<<<<<<<<<<<<<<<<<<<
};

export default screenService;