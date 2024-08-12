import React from 'react';
import { Line } from 'react-chartjs-2';

const IncomeChart = ({ orderStats }) => {
    // Extract labels and data from orderStats
    const labels = orderStats.map(([date, _]) => date);
    const data = orderStats.map(([_, income]) => income);

    // Chart data configuration
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Total Income',
                data: data,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                lineTension: 0.1
            }
        ]
    };

    // Chart options configuration
    const chartOptions = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        }
    };

    return <Line data={chartData} options={chartOptions} />;
};

export default IncomeChart;
