import axios from "axios";

const BACKEND_URL = 'http://localhost:5000';


// Create New Product
const createProduct = async (formData) => {
  const response = await axios.post(`${BACKEND_URL}/api/products`, formData);
  return response.data;
  
};
/// Get All Products in the Database

const getAllProducts = async () => {
  const response = await axios.get(`${BACKEND_URL}/api/products/all`);
  return response.data;
  
};

// Get Single Product for Marketplace without user

const getSingleProductAll = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/api/products/${id}`);
  return response.data;
  
};

// Get Products by Category

const getProdcutsByCategory = async (category) => {
  const response = await axios.get(`${BACKEND_URL}/api/products/category/${category}`);
  return response.data;
  
  
};


// Get All Products
const getProducts = async () => {
  const response = await axios.get(`${BACKEND_URL}/api/products`);
 
  return response.data;
  
};
// Delete a Product
const deleteProducts = async (id) => {
  const response = await axios.delete(`${BACKEND_URL}/api/products/${id}`);
  return response.data;
  
};

// Get a Product
const getProduct = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/api/products/${id}`);
  return response.data;
};

// Update Product

const updateProducts = async (id, formData) => {
  const response = await axios.patch(`${BACKEND_URL}/api/products/${id}`,formData);
  console.log(response.data);
  return response.data;
  
};

// get Products by User
const getProductsById = async (userId) => {
  const response = await axios.get(`${BACKEND_URL}/api/products/user-products/${userId}`);
  
  return response.data;
};

// generate Report

const generateReport = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/products/report/generate`, {
      responseType: 'blob', // Important for handling the PDF data
    });
    
    return response.data; // Returns the blob to the caller
  } catch (error) {
    console.error('Error generating report:', error);
    throw error; // Rethrow to allow caller to handle it
  }
};

 const productService = {
    createProduct,
    getProducts,
    deleteProducts,
    updateProducts,
    getProduct,
    getAllProducts,
    getSingleProductAll,
    getProdcutsByCategory,
    getProductsById,
    generateReport,
 }

 export default productService;
