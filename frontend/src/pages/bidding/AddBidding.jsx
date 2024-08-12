import React, { useState, useEffect } from 'react';
import { Button, Modal } from "react-bootstrap";
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import { BsCircle } from 'react-icons/bs';
import { IoMdAddCircleOutline } from "react-icons/io";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import GlobalStyles from '../../GlobalStyles';
import axios from "axios";
import './AddBidding.scss';


const AddBidding = () => {
    const [data, setData] = useState([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [biddingToDelete, setBiddingToDelete] = useState(null);

    useEffect(() => {
        fetchBiddings();
    }, []);

    const fetchBiddings = async () => {
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

    const handleOpenConfirmationModal = (id) => {
        setBiddingToDelete(id);
        setShowConfirmationModal(true);
    };

    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false);
        setBiddingToDelete(null);
    };

    // Function to handle confirmed deletion
    const handleConfirmDeletion = () => {
      handleDelete(biddingToDelete);
      setShowConfirmationModal(false);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/buyer/delete/${id}`);
            fetchBiddings();
            toast.success('Bidding deleted successfully!');
            handleCloseConfirmationModal();
        } catch (error) {
            console.error("Error deleting bidding:", error);
            toast.error('Error deleting bidding!');
        }
    };

    return (
        <div className="bidding-list" style={{ color: 'black' }}>
            <GlobalStyles />

            <h2 style={{ textAlign: 'center' }}>Bidding List</h2>

            <div className="btnn" style={{ marginLeft: '100px' }}>
                <Link to="/biddingForm">
                    <Button variant="primary" className="m-1" style={{ display: 'flex', gap: '20px', width:'170px' }}>
                        <IoMdAddCircleOutline className="mb-1" style={{}} /> <span style={{fontSize:'18px'}}>Add a Bid</span>
                    </Button>
                </Link>
            </div>

            <div className="mt-5" style={{marginTop: '100px', marginLeft: '50px' }}>
                    <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Image</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Location</th>
                            <th>Starting Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map((bidding) => (
                                <tr key={bidding._id}>
                                    <td>{bidding.title}</td>
                                    <td>{bidding.image ? (
                                        <img src={bidding.image.filePath} alt={bidding.title} width="50" height="50" />
                                    ) : (
                                        <BsCircle size={30} />
                                    )}</td>
                                    <td>{bidding.description}</td>
                                    <td>{bidding.category}</td>
                                    <td>{bidding.location}</td>                                  
                                    <td>Rs. {bidding.startingPrice}</td>
                                    <td style={{display:'flex'}}>

                                        <Link to={`/updateBiddingForm/${bidding._id}`}>
                                            <Button className="m-1 px-3" variant="info" size="sm">
                                                <MdEdit className="mb-1 mx-1" />
                                                <span>Edit</span>
                                            </Button>
                                        </Link>
                                        <Button className="m-1 px-3" variant="danger" size="sm" onClick={() => handleOpenConfirmationModal(bidding._id)}>
                                            <AiTwotoneDelete className="mb-1 mx-1" />
                                            <span>Delete</span>
                                        </Button>
                                
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7}>No data available</td>
                            </tr>
                        )}
                    </tbody>
                    </table>
            </div>
            <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this bidding?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseConfirmationModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDeletion}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AddBidding;