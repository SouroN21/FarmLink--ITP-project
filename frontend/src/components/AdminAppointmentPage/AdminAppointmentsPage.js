import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../../assets/logo.png';
import './AdminAppointmentsPage.scss';

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [monthlyAppointmentsData, setMonthlyAppointmentsData] = useState([]);
  const chartRef = useRef(null); // Reference to the Chart instance

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    generateMonthlyAppointmentsData();
  }, [appointments]); // Update monthly appointments data whenever appointments change

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/appointments');
      if (response.status === 200) {
        const acceptedAppointments = response.data.filter(appointment => appointment.status === 'Accepted');
        setAppointments(acceptedAppointments);
      } else {
        console.error('Failed to fetch appointments:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const generateMonthlyAppointmentsData = () => {
    const monthlyAppointments = new Array(12).fill(0); // Initialize array to hold monthly appointments count

    // Count appointments for each month
    appointments.forEach(appointment => {
      const month = new Date(appointment.date).getMonth();
      monthlyAppointments[month]++;
    });

    setMonthlyAppointmentsData(monthlyAppointments);
  };
  const generateTableImage = async () => {
    const tableContainer = document.querySelector('.admin-appointments-page table');
    const tableCanvas = await html2canvas(tableContainer);
    return tableCanvas.toDataURL('image/png');
  };
  
  const generateChartImage = async () => {
    const chartContainer = document.querySelector('.line-chart-container canvas');
    const chartCanvas = await html2canvas(chartContainer);
    return chartCanvas.toDataURL('image/png');
  };
  

  // Chart.js code to create the line chart
  useEffect(() => {
    const ctx = document.getElementById('monthlyAppointmentsChart');

    if (ctx) {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy previous chart if it exists
      }

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Monthly Appointments',
            data: monthlyAppointmentsData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }, [monthlyAppointmentsData]);

  const generatePDF = () => {
    // Initialize jsPDF document
    const pdf = new jsPDF();
  
    // Add the company logo
    pdf.addImage(logo, 'JPEG', 160, 10, 30, 30);
  
    // Header information (Company Contact)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(60, 80, 60); // Dark green color
    pdf.text('FarmLink.Org', 10, 10);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text('Email: FarmLink.Org@outlook.com', 10, 20);
    pdf.text('Phone: 0761827545', 10, 30);
  
    // Add title to the PDF
    pdf.text('Monthly Appointments', 50, 50);
  
    // Generate table data
    const tableData = [];
    appointments.forEach(appointment => {
      tableData.push([
        `${appointment.firstName} ${appointment.lastName}`,
        appointment.email,
        appointment.message,
        new Date(appointment.date).toLocaleDateString(),
        appointment.time
      ]);
    });
  
    // Add table to PDF
    pdf.autoTable({
      startY: 60, // Start position Y
      head: [['Name', 'Email', 'Message', 'Date', 'Time']], // Table header
      body: tableData // Table data
    });
  
    // Generate chart as image
    const chartImage = chartRef.current.toBase64Image();
  
    // Add the chart image to the PDF
    pdf.addImage(chartImage, 'PNG', 10, pdf.lastAutoTable.finalY + 10, 180, 80);
  
    // Save the PDF
    pdf.save('monthly-appointments.pdf');
  };
  
  
  
  
  return (
    <div className="admin-appointments-page">
      <h2>All Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={index}>
              <td>{appointment.firstName} {appointment.lastName}</td>
              <td>{appointment.email}</td>
              <td>{appointment.message}</td>
              <td>{new Date(appointment.date).toLocaleDateString()}</td>
              <td>{appointment.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <h2>Monthly Accepted Appointments</h2>

      <div className="line-chart-container">
        <canvas id="monthlyAppointmentsChart"></canvas>
      </div>
  
      <div className="download-pdf-container">
        <button onClick={generatePDF}>Download PDF</button>
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;
