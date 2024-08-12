import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const TopProductsByQuantityChart = () => {
  const [topProductsData, setTopProductsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/order/');
        const orders = response.data;

        const productQuantities = {};
        orders.forEach(order => {
          order.purchasedItems.forEach(item => {
            const { name, quantity } = item;
            if (name !== "Product Name") {
              productQuantities[name] = (productQuantities[name] || 0) + quantity;
            }
          });
        });

        const sortedProducts = Object.entries(productQuantities)
          .sort(([, quantityA], [, quantityB]) => quantityB - quantityA)
          .slice(0, 5);

        const labels = sortedProducts.map(([name]) => name);
        const data = sortedProducts.map(([, quantity]) => quantity);

        // Define an array of colors
        const colors = ['skyblue', 'salmon', 'lightgreen', 'orange', 'violet'];

        const datasets = [{
          label: 'Top 5 Products by Quantity Sold',
          data,
          backgroundColor: colors, // Use colors array for different colors
        }];

        setTopProductsData({
          labels,
          datasets,
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        topProductsData && (
          <div>
            <h2>Top 5 Products by Quantity Sold</h2>
            <div style={{ height: '400px', width: '600px' }}>
              <Bar
                data={topProductsData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TopProductsByQuantityChart;
