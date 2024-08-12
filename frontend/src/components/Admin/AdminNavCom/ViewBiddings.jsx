import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { BsCircle } from 'react-icons/bs';
import { IoMdAddCircleOutline } from "react-icons/io";
import { generatePDF } from './GeneratePDF';


const ViewBiddings = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/buyer/getAllPosts');
          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const jsonData = await response.json();
          console.log('API Response:', jsonData); // Log the API response
          setData(jsonData.response); // Update to access jsonData.response
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, []);
     // Empty dependency array means this effect runs once after initial render
  
    console.log('Data state:', data); // Log the state of data for debugging

    const handleDownloadReport = () => {
        // Define columns for the PDF table
        const columns = ['description', 'category', 'location', 'title', 'startingPrice'];
        // Define title and fileName for the PDF
        const title = 'Bidding Report';
        const fileName = 'bidding_report';
        // Generate PDF with the data
        generatePDF(title, columns, data, fileName);
      };
  
    return (
        <div className="p-5 ">
                      
        <div style={{ color: 'black' }}>                    
          <h1 style={{ textAlign: 'center', fontSize:'30px'}}>Bidding List</h1>
  
        <div className="btnn" style={{marginLeft:'100px'}}>
          <Button variant="primary" className="m-1" style={{ display: 'flex', gap: '20px'}} onClick={handleDownloadReport}>
            <IoMdAddCircleOutline className="mb-1" /> <span>Download Report</span>          
          </Button>        
        </div>

        <div className="mt-5" style={{ zIndex: '5', marginLeft: '50px' }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Description</th>
                <th>Category</th>
                <th>Location</th>
                <th>Title</th>
                <th>Starting Price</th>               
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((bidding) => (
                  <tr key={bidding._id}>
                    <td>{bidding.image ? (
                        <img src={bidding.image.filePath} alt={bidding.title} width="50" height="50" />
                      ) : (
                        <BsCircle size={30} />
                      )}</td>
                    <td>{bidding.description}</td>
                    <td>{bidding.category}</td>
                    <td>{bidding.location}</td>
                    <td>{bidding.title}</td>
                    <td>Rs. {bidding.startingPrice}</td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>No data available</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div></div>
    );
}

export default ViewBiddings