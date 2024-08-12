import React from 'react';
import { Pie } from 'react-chartjs-2'; // Import Pie from react-chartjs-2

const OrderChart = ({ shippedOrders, pendingOrders }) => {
    const data = {
        labels: ['Shipped', 'Pending'],
        datasets: [
            {
                label: 'Number of Orders',
                data: [shippedOrders, pendingOrders],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)', // Shipped Orders
                    'rgba(255, 99, 132, 0.5)', // Pending Orders
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        // You can customize options for the Pie chart here if needed
    };

    return <Pie data={data} options={options} />; // Use Pie instead of Bar
};

export default OrderChart;
