import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = 'http://localhost:5000';


// Get Login Status 

export const getLoginStatus = async (userData, resetToken) => {
  try {

    const response = await axios.get(`${BACKEND_URL}/api/auth/loggedin`);
    
    return response.data

  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Get user By id 

const getUserById = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:5000/users/${userId}`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};




const authService = {
    getUserById,
}

export default authService;