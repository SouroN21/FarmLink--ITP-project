import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChart = ({ vegiQuantity, fruitQuantity }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const renderChart = () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy(); // Ensure to destroy the previous chart instance
      }

      // Directly setting the dimensions of the canvas
      const canvas = chartRef.current;
      canvas.width = 400;
      canvas.height = 400;

      chartInstanceRef.current = new Chart(canvas, {
        type: 'pie',
        data: {
          labels: ['Vegetables', 'Fruits'],
          datasets: [{
            data: [vegiQuantity, fruitQuantity],
            backgroundColor: ['#36a2eb', '#ff6384'],
          }],
        },
        options: {
          responsive: false, // Turn off responsiveness
          maintainAspectRatio: false,
          animation: {
            onComplete: () => {
              canvas.style.width = '400px';
              canvas.style.height = '400px';
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
            },
          },
        },
      });
    };

    renderChart();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [vegiQuantity, fruitQuantity]); // Re-render only when quantities change

  return <canvas ref={chartRef} />;
};

export default PieChart;
