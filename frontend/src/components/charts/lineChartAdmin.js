import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Important: This automatically registers the chart type
import axios from 'axios';

const LineChartAdmin = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order details
        const orderResponse = await axios.get('http://localhost:5000/api/order/');
        const orders = orderResponse.data;

        // Initialize an object to store daily sales
        const dailySales = {};

        // Calculate total cost for each day
        orders.forEach(order => {
          const orderDate = new Date(order.orderDate).toISOString().slice(0, 10); // Extracting date without time
          const totalCost = order.totalCost; // Assuming total cost is available directly in order
          dailySales[orderDate] = (dailySales[orderDate] || 0) + totalCost;
        });

        // Prepare chart data from daily sales
        const labels = Object.keys(dailySales);
        const salesData = Object.values(dailySales);

        // Update chart data
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Daily Sales',
              data: salesData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light blue color for bars
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Handle error if needed
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {chartData && (
        <Bar data={chartData} options={{}} />
      )}
    </div>
  );
};

export default LineChartAdmin;
