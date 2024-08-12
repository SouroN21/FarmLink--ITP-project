import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import productService from "../../redux/features/product/ProductService";
import logo from "../../assets/logo.png";
import { Card } from "react-bootstrap";
import ProductsTable from "./ProductTable";
import "./AdminReport.css";
import PieChart from "../charts/PieChart";
import MostBoughtProductsChart from "../charts/ProductAdminOverviewTable";
import TopProductsByQuantityChart from "../charts/TopProductsByQuantityChart";
import axios from "axios";
import downloadPDF from "./downloadPDF";
import LineChartAdmin from "../charts/lineChartAdmin";
import { useNavigate } from "react-router-dom";

const ProductAdminReport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [outOfStock, setOutOfStock] = useState([]);
  const [inventoryValue, setInventoryValue] = useState(0);
  const [vegiQuantity, setVegiQuantity] = useState(0);
  const [fruitQuantity, setFruitQuantity] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getAllProducts();
        const parsedProducts = res.map((product) => ({
          ...product,
          quantity: parseInt(product.quantity, 10),
        }));

        const vegiProducts = parsedProducts.filter(
          (product) => product.category === "Vegetable"
        );
        const fruitProducts = parsedProducts.filter(
          (product) => product.category === "Fruit"
        );

        const totalVegiQuantity = vegiProducts.reduce(
          (acc, product) => acc + product.quantity,
          0
        );
        const totalFruitQuantity = fruitProducts.reduce(
          (acc, product) => acc + product.quantity,
          0
        );

        setOutOfStock(parsedProducts.filter((product) => product.quantity < 1));
        setInventoryValue(
          parsedProducts.reduce(
            (acc, product) => acc + product.quantity * product.price,
            0
          )
        );
        setVegiQuantity(totalVegiQuantity);
        setFruitQuantity(totalFruitQuantity);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchOrdersAndCalculateRevenue = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/order/");
        const orders = response.data;

        // Calculate total revenue
        const totalRevenue = orders.reduce(
          (total, order) => total + order.totalCost,
          0
        );

        // Log the orders and total revenue
        console.log("Orders:", orders);
        console.log("Total Revenue:", totalRevenue);

        // Set the total revenue state
        setTotalRevenue(totalRevenue);

        // Set the orders state
        setOrders(orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndCalculateRevenue(); // Fetch orders and calculate revenue when the component mounts
  }, []);

  const handleDownloadPdf = () => {
    downloadPDF(
      vegiQuantity,
      fruitQuantity,
      inventoryValue,
      totalRevenue,
      outOfStock
    );
  };

  const productAdminAdvancedData = () => {
    navigate("/admin/sales");
  };
  return (
    <div style={{ margin: "10px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Card>
            <div className="card-section">
              <div className="quantity-details">
                <h2>Quantity Details</h2>
                <p>Total Vegetable Quantity: {vegiQuantity}</p>
                <p>Total Fruit Quantity: {fruitQuantity}</p>
              </div>
              <div className="financial-summary">
                <h2>Financial Summary</h2>
                <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
                <p>Inventory Value: ${inventoryValue.toFixed(2)}</p>
              </div>
              <button className="download-button" onClick={handleDownloadPdf}>
                Download PDF
              </button>
            </div>
          </Card>

          <div>
            <h1 style={{ fontSize: "1.5rem", textAlign: "center" }}>
              Category Analisis
            </h1>
            <br />
            <br />
            <br />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PieChart
                vegiQuantity={vegiQuantity}
                fruitQuantity={fruitQuantity}
              />
            </div>
          </div>

          <br />
          <br />
          <br />
          <br />
          <div>
            <h1 style={{ fontSize: "1.5rem", textAlign: "center" }}>
              Daily Sales
            </h1>
            <br />
            <br />
            <br />
            <div style={{ width: "1000px" }}>
              <LineChartAdmin />
              <div style={{ marginTop: "5rem", textAlign: "center" }}>
                <button
                  onClick={productAdminAdvancedData}
                  style={{
                    backgroundColor: "red",
                    border: "none",
                    color: "white",
                    padding: "15px 32px",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "inline-block",
                    fontSize: "16px",
                    margin: "4px 2px",
                    cursor: "pointer",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  Advanced Sales Details
                </button>
              </div>
            </div>
          </div>

          <br />
          <br />
          <br />
          <br />
          <div>
            <h1 style={{ fontSize: "1.5rem", textAlign: "center" }}>
              Product Performance
            </h1>
            <br />
            <br />
            <br />
            <div className="charts-container">
              <MostBoughtProductsChart />
              <TopProductsByQuantityChart />
            </div>
          </div>

          <div style={{ marginTop: "10rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "1.5rem" }}>Products Table</h1>
            <br />
            <br />
            <ProductsTable />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductAdminReport;
