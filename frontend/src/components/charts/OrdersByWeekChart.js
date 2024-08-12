import React from 'react';
import { Bar } from 'react-chartjs-2';

const OrdersByWeekChart = ({ orderStats }) => {
    // Initialize arrays to hold the total number of orders for each day of the week
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const ordersByDayOfWeek = [0, 0, 0, 0, 0, 0, 0];

    // Iterate over orderStats and populate ordersByDayOfWeek array
    orderStats.forEach(([date, total]) => {
        const dayIndex = new Date(date).getDay(); // Get the day index (0 for Sunday, 1 for Monday, etc.)
        ordersByDayOfWeek[dayIndex] += total; // Accumulate total orders for each day of the week
    });

    const data = {
        labels: daysOfWeek,
        datasets: [
            {
                label: 'Total Orders',
                data: ordersByDayOfWeek,
                backgroundColor: [
                    'rgba(75,192,192,0.5)',
                    'rgba(75,192,192,0.5)',
                    'rgba(75,192,192,0.5)',
                    'rgba(75,192,192,0.5)',
                    'rgba(75,192,192,0.5)',
                    'rgba(75,192,192,0.5)',
                    'rgba(75,192,192,0.5)',
                ],
                borderColor: [
                    'rgba(75,192,192,1)',
                    'rgba(75,192,192,1)',
                    'rgba(75,192,192,1)',
                    'rgba(75,192,192,1)',
                    'rgba(75,192,192,1)',
                    'rgba(75,192,192,1)',
                    'rgba(75,192,192,1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };

    return <Bar data={data} options={options} />;
};

export default OrdersByWeekChart;
