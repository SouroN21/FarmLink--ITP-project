import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductAdminAdvancedData = () => {
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order details
        const orderResponse = await axios.get(
          "http://localhost:5000/api/order/"
        );
        const orders = orderResponse.data;

        // Initialize objects to store sales data
        const hourlySales = Array.from({ length: 24 }, () => 0);
        const dailySales = {};
        const monthlySales = Array.from({ length: 12 }, () => 0);
        const yearlySales = {};

        // Calculate total cost for each hour, day, month, and year
        orders.forEach((order) => {
          const orderDate = new Date(order.orderDate);
          const hour = orderDate.getHours();
          const day = orderDate.toISOString().slice(0, 10);
          const month = orderDate.getMonth();
          const year = orderDate.getFullYear();

          // Hourly sales
          hourlySales[hour] += order.totalCost;

          // Daily sales
          dailySales[day] = (dailySales[day] || 0) + order.totalCost;

          // Monthly sales
          monthlySales[month] += order.totalCost;

          // Yearly sales
          yearlySales[year] = (yearlySales[year] || 0) + order.totalCost;
        });

        // Update sales data state
        setSalesData({
          hourly: hourlySales,
          daily: dailySales,
          monthly: monthlySales,
          yearly: yearlySales,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Handle error if needed
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Total Sales</h2>
      <br/>
      <br/>
      {salesData && (
        <div>
          <div>
            <h3>Hourly Sales</h3>
          
            
            <table>
              <thead>
                {salesData.hourly.map((sales, index) => (
                  <tr key={index}>
                    <td>
                      {index}:00 - {index + 1}:00
                    </td>
                    <td>${sales.toFixed(2)}</td>
                  </tr>
                ))}
              </thead>
            </table>
          </div>

          <div>
          <br/>
          
            <h3>Daily Sales</h3>

            
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(salesData.daily).map(([day, sales]) => (
                  <tr key={day}>
                    <td>{day}</td>
                    <td>${sales.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
          <br/>
            <h3>Monthly Sales</h3>
           
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {salesData.monthly.map((sales, index) => (
                  <tr key={index}>
                    <td>
                      {new Date(2000, index).toLocaleString("default", {
                        month: "long",
                      })}
                    </td>
                    <td>${sales.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
          <br/>
            <h3>Yearly Sales</h3>
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(salesData.yearly).map(([year, sales]) => (
                  <tr key={year}>
                    <td>{year}</td>
                    <td>${sales.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAdminAdvancedData;
