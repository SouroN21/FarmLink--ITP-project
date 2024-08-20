import axios from "axios";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddProduct from "./pages/addProduct/AddProduct";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getLoginStatus } from "./services/authService";
import { SET_LOGIN } from "./redux/features/auth/authSlice";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/dashboard/Dashboard";
import Layout from "./components/layout/Layout";
import Sidebar from "./components/sidebar/Sidebar";
import "react-toastify/dist/ReactToastify.css";
import EditProduct from "./pages/editProduct/EditProduct";
import Categories from "./pages/marketplace/categories/Categories";
import MarketplaceNavbar from "./components/marketplaceNav/MarketplaceNavbar";
import { CategoryProvider } from "./customHook/CategoryProvider";
import ProductDetailsfarmer from "../src/components/product/productDetails/ProductDetails";
import ProductDetails from "./pages/marketplace//details/ProductDetails";
import MarketHome from "./pages/marketplace/home/marketHomePage";
import ProductAdminReport from "./components/productAdminReport/productAdminReport";
import AssignDelivery from "./components/AssignDelivery";
import AllDeliveries from "./components/AllDeliveries";
import AllBuddies from "./components/AllBuddies";
import ListBuddy from "./components/ListBuddy";
import AppointmentListPage from "./components/appointmentList/AppointmentListPage";
import AppointmentFormPage from "./components/appointmentForm/AppointmentFormPage";
import ExpertForm from "./components/expertListingForm/expertListingForm";
import ExpertDetails from "./components/expertList/expertList";
import ExpertAppointmentsPage from "./components/expertAppointment/expertAppointmentPage";
import AdminMain from "./components/Admin/AdminMain";
import Signup from "./components/Singup";
import Login from "./components/Login";
import DeliveryMain from "./components/Delivery/DeliveryMain";
import ExpertMain from "./components/Expert/ExpertMain";
import Allfeedbacks from './components/Allfeedbacks'; 
import Addfeedback from './components/Addfeedback';
import AcceptFeedbacks from './components/Acceptfeedbacks';
import AcceptedFeedbacks from './components/Acceptedfeedbacks';
import Cart from './pages/marketplace/details/Cart';
import Order from './pages/marketplace/details/Orders';
import BiddingList from "./pages/bidding/BiddingList/BiddingList";
import BiddingDetails from "./pages/bidding/BiddingDetails/BiddingDetails";
import AddBidding from "./pages/bidding/AddBidding";
import BiddingForm from "./pages/bidding/BiddingForm";
import UpdateBiddingForm from "./pages/bidding/UpdateBiddingForm";
import UpdateBuyer from "./components/marketplaceNav/UpdateBuyer";
import BidCheckout from './pages/bidding/bidCheckout/BidCheckout';
import AllFeedbacks from "./components/Allfeedbacks";
import BarChart from "./components/charts/ProductAdminOverviewTable";
import Successful from "./pages/marketplace/details/successful";
import Unuccessful from "./pages/marketplace/details/unuccessful";
import OrdersPage from "./pages/orders/OrdersPage";


axios.defaults.withCredentials = true;
let user;

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    async function loginStatus() {
      const status = await getLoginStatus();
      dispatch(SET_LOGIN(status));
    }
    loginStatus();
  }, [dispatch]);

  try {
    user = JSON.parse(localStorage.getItem("role"));
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return <Navigate to="/login" />;
  }

  return (
    <div className="App">
      <CategoryProvider>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            {user && user.role === "admin" && (
              <Route path="/*" element={<AdminMain />} />
            )}
            {user && user.role === "buyer" && (
              <Route
                path="/**"
                element={
                  <MarketplaceNavbar showCategories={false}>
                    <MarketHome />
                  </MarketplaceNavbar>
                }
              />
            )}
            {user && user.role === "farmer" && (
              <Route
                path="/*"
                element={
                  <Sidebar>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </Sidebar>
                }
              />
            )}
            {user && user.role === "delivery" && (
              <Route path="/*" element={<DeliveryMain />} />
            )}
            {user && user.role === "expert" && (
              <Route path="/*" element={<ExpertMain />} />
            )}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate replace to="/login" />} />

            <Route path="/updateBuyer" element={<UpdateBuyer />}/>
            <Route path="/market" element={<MarketplaceNavbar showCategories={true}>
            <Categories />
                </MarketplaceNavbar>
              }
            />

            <Route
              path="/product/:productId"
              element={
                <MarketplaceNavbar showCategories={false}>
                  <ProductDetails />
                </MarketplaceNavbar>
              }
            />

            <Route
              path="/dashboard"
              element={
                <Sidebar>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </Sidebar>
              }
            />

            <Route
              path="/add-product"
              element={
                <Sidebar>
                  <Layout>
                    <AddProduct />
                  </Layout>
                </Sidebar>
              }
            />
            <Route
              path="/my-orders"
              element={
                <Sidebar>
                  <Layout>
                    <OrdersPage />
                  </Layout>
                </Sidebar>
              }
            />

            <Route
              path="/product-detail/:id"
              element={
                <Sidebar>
                  <Layout>
                    <ProductDetailsfarmer />
                  </Layout>
                </Sidebar>
              }
            />


            <Route
              path="/edit-product/:id"
              element={
                <Sidebar>
                  <Layout>
                    <EditProduct />
                  </Layout>
                </Sidebar>
              }
            />

            <Route
              path="/product-admin"
              element={
                <Sidebar>
                  <Layout>
                    <ProductAdminReport />
                  </Layout>
                </Sidebar>
              }
            />

            <Route
              path="/assign"
              element={
                <Sidebar>
                  <Layout>
                    <AssignDelivery />
                  </Layout>
                </Sidebar>
              }
            />

            <Route
              path="/view"
              element={
                <Sidebar>
                  <Layout>
                    <AllDeliveries />
                  </Layout>
                </Sidebar>
              }
            />

            <Route
              path="/list-buddy"
              element={
                <Sidebar>
                  <Layout>
                    <ListBuddy />
                  </Layout>
                </Sidebar>
              }
            />

            <Route
              path="/all-buddies"
              element={
                <Sidebar>
                  <Layout>
                    <AllBuddies />
                  </Layout>
                </Sidebar>
              }
            />


            <Route
              path="/appointment-list"
              element={
                <Sidebar>
                  <Layout>
                    <AppointmentListPage />
                  </Layout>
                </Sidebar>
              }
            />
            <Route
              path="/appointment-form"
              element={
                <Sidebar>
                  <Layout>
                    <AppointmentFormPage />
                  </Layout>
                </Sidebar>
              }
            />
            <Route
              path="/expertForm"
              element={
                <Sidebar>
                  <Layout>
                    <ExpertForm />
                  </Layout>
                </Sidebar>
              }
            />
            <Route
              path="/expertlist"
              element={
                <Sidebar>
                  <Layout>
                    <ExpertDetails />
                  </Layout>
                </Sidebar>
              }
            />
            <Route
              path="/expertAppointment"
              element={
                <Sidebar>
                  <Layout>
                    <ExpertAppointmentsPage />
                  </Layout>
                </Sidebar>
              }
            />
        
        <Route path="/allfeedback" element=
            {<MarketplaceNavbar showCategories={false}><AllFeedbacks /></MarketplaceNavbar>} />
            <Route path="/add" element={<Addfeedback />} />
            <Route path="/accept" element={<AcceptFeedbacks />} />
            <Route path="/accepted-feedbacks" element={<AcceptedFeedbacks />} />

           <Route path="/successful" element={<Successful />} />

           <Route path="/unuccessful" element={<Unuccessful />} />

            <Route path="/cart" element={
              <MarketplaceNavbar showCategories={false}>
                <Cart />
              </MarketplaceNavbar>
            } />

            <Route path="/orders" element={
              <MarketplaceNavbar showCategories={false}>
                <Order />
              </MarketplaceNavbar>
            } />


            <Route path="/bidding" element={
              <MarketplaceNavbar showCategories={true}>
                <BiddingList />
              </MarketplaceNavbar>
            } />

            <Route path="/bidding/bids" element={
              <MarketplaceNavbar showCategories={true}>
                <BidCheckout />
              </MarketplaceNavbar>
            } />

            <Route path="/bidding/:biddingId" element={
              <MarketplaceNavbar showCategories={false}>
                <BiddingDetails />
              </MarketplaceNavbar>
            } />
            <Route
              path="/addBidding"
              element={
                <Sidebar>
                  <Layout>
                    <AddBidding />
                  </Layout>
                </Sidebar>
              }
            />
            <Route
              path="/biddingForm"
              element={
                <Sidebar>
                  <Layout>
                    <BiddingForm />
                  </Layout>
                </Sidebar>
              }
            />
            <Route
              path="/updateBiddingForm/:id"
              element={
                <Sidebar>
                  <Layout>
                    <UpdateBiddingForm />
                  </Layout>
                </Sidebar>
              }
            />



          </Routes>
        </BrowserRouter>
      </CategoryProvider>
    </div>
  );
}

export default App;
