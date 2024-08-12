import axios from "axios";

const BACKEND_URL = 'http://localhost:5000';


/// Get All Products in the Database

const getAllBiddings = async () => {
  const response = await axios.get(`${BACKEND_URL}/api/buyer/getAllPosts`);
  console.log("Controller Res  : ", response);
  return response.data;
  
};

// Get biddibgs by Category

const getBiddingsByCategory = async (category) => {
  const response = await axios.get(`${BACKEND_URL}/api/buyer/category/${category}`);
  return response.data;
  
};


// Get a biddibgs
const getBidding = async (id) => {
  const response = await axios.get(`${BACKEND_URL}/api/buyer/getPost/${id}`);
  console.log("Get Bidding Data : ", response);
  return response.data;
};


// get biddibgs by User
const getBiddingsByUser = async (userId) => {
  const response = await axios.get(`${BACKEND_URL}/api/buyer/user-biddings/${userId}`);
  
  return response.data;
};
//get biddings for checkout
const getBiddingsForCheckout = async (userId) => {
  const response = await axios.get(`${BACKEND_URL}/api/bidding/bids/${userId}`);
  
  return response.data;
};



 const biddingService = {
    getAllBiddings,
    getBidding,
    getBiddingsByCategory,
    getBiddingsByUser,
    getBiddingsForCheckout
 }

 export default biddingService;