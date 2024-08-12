import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const MostBoughtProductsChart = () => {
  const [topProductsData, setTopProductsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/order/');
        const orders = response.data;

        const productCounts = {};
        orders.forEach(order => {
          order.purchasedItems.forEach(item => {
            const { name } = item;
            if (name !== "Product Name") {
              productCounts[name] = (productCounts[name] || 0) + 1;
            }
          });
        });

        const sortedProducts = Object.entries(productCounts)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 5);

        const labels = sortedProducts.map(([name]) => name);
        const data = sortedProducts.map(([, count]) => count);

        // Define an array of colors
        const colors = ['skyblue', 'salmon', 'lightgreen', 'orange', 'violet'];

        const datasets = [{
          label: 'Top 5 Most Bought Products',
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
            <h2>Top 5 Most Bought Products</h2>
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

export default MostBoughtProductsChart;
