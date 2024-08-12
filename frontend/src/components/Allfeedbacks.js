import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StarRating from './StarRating'; // Assuming StarRating component is in the same directory
import GlobalStyles from '../GlobalStyles';

export default function AllFeedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [acceptedFeedbacks, setAcceptedFeedbacks] = useState([]);
    const [updatedFeedback, setUpdatedFeedback] = useState({
        name: "",
        email: "",
        message: "",
        starRating: 0 // Set initial star rating value
    });
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedRow, setHighlightedRow] = useState(null); // Changed initial state to null
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedbacks();
        fetchAcceptedFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/feedback");
            setFeedbacks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            setLoading(false);
        }
    };

    const fetchAcceptedFeedbacks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/feedback/accepted");
            setAcceptedFeedbacks(response.data);
        } catch (error) {
            console.error('Error fetching accepted feedbacks:', error);
        }
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/feedback/delete/${id}`)
            .then((res) => {
                setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
                alert("Feedback deleted successfully");
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleUpdateClick = (feedback) => {
        setUpdatedFeedback(feedback);
        setShowUpdateForm(true);
    };

    const handleUpdateSubmit = () => {
        const { _id } = updatedFeedback;
        axios.put(`http://localhost:5000/feedback/update/${_id}`, updatedFeedback)
            .then((res) => {
                const { status, updatedFeedback } = res.data;
                if (status === "Feedback updated") {
                    const updatedFeedbacks = feedbacks.map((feedback) =>
                        feedback._id === _id ? updatedFeedback : feedback
                    );
                    setFeedbacks(updatedFeedbacks);
                    alert("Feedback updated successfully");
                    setShowUpdateForm(false);
                } else {
                    alert("Feedback not found");
                }
            })
            .catch((err) => {
                alert("Error occurred while updating feedback");
            });
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase(); // Convert query to lowercase for case-insensitive search
        setSearchQuery(query);
        setHighlightedRow(null); // Reset highlighted row

        const index = feedbacks.findIndex(feedback => feedback.name.toLowerCase().includes(query));
        if (index !== -1) {
            setHighlightedRow(index);
        }
    };

    if (loading) {

        return <div>
            <GlobalStyles/>
            Loading...</div>;
    }

    return (

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
             <GlobalStyles/>
            <div style={{ width: '80%' }}>
                <h1>All Feedbacks</h1>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{ marginBottom: '20px', padding: '4px 8px', width: '150px' }} // Adjusted search bar size
                />
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', background: '#f2f2f2' }}>Name</th>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', background: '#f2f2f2' }}>Email</th>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', background: '#f2f2f2' }}>Message</th>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', background: '#f2f2f2' }}>Star Rating</th>
                            <th style={{ border: '1px solid #dddddd', padding: '8px', background: '#f2f2f2' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback, index) => (
                            <tr key={feedback._id} style={highlightedRow === index ? { backgroundColor: 'yellow' } : null}>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{feedback.name}</td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{feedback.email}</td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{feedback.message}</td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>
                                    {feedback.starRating}
                                </td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>
                                    {feedback.status !== 'Accepted' ? (
                                        <>
                                             <button onClick={() => handleUpdateClick(feedback)} style={{ backgroundColor: '#4CAF50', color: 'white', marginRight: '5px' }}>Update</button>
                                    <button onClick={() => handleDelete(feedback._id)} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
                                        </>
                                    ) : (
                                            <span>Accepted</span>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showUpdateForm && (
                    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: '#f2f2f2' }}>
                        <h2>Update Feedback</h2>
                        <input
                            type="text"
                            value={updatedFeedback.name}
                            onChange={(e) => setUpdatedFeedback({ ...updatedFeedback, name: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                        <input
                            type="email"
                            value={updatedFeedback.email}
                            onChange={(e) => setUpdatedFeedback({ ...updatedFeedback, email: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                        <textarea
                            value={updatedFeedback.message}
                            onChange={(e) => setUpdatedFeedback({ ...updatedFeedback, message: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                        <StarRating value={updatedFeedback.starRating} onChange={(value) => setUpdatedFeedback({ ...updatedFeedback, starRating: value })} />
                        <button onClick={handleUpdateSubmit} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px' }}>Submit Update</button>
                    </div>
                )}
                <Link to="/accepted-feedbacks">View Accepted Feedbacks</Link>
            </div>
        </div>
    );
}
