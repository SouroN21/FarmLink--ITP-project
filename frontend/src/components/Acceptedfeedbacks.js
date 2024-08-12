import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

export default function AcceptedFeedbacks() {
    const [acceptedFeedbacks, setAcceptedFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAcceptedFeedbacks();
    }, []);

    const fetchAcceptedFeedbacks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/feedback/accepted");
            setAcceptedFeedbacks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching accepted feedbacks:', error);
            setLoading(false);
        }
    };

    const handleLike = async (id) => {
        try {
            await axios.put(`http://localhost:5000/feedback/like/${id}`);
            fetchAcceptedFeedbacks(); // Fetch updated feedback data after liking
        } catch (error) {
            console.error('Error liking feedback:', error);
        }
    };

    const handleDislike = async (id) => {
        try {
            await axios.put(`http://localhost:5000/feedback/dislike/${id}`);
            fetchAcceptedFeedbacks(); // Fetch updated feedback data after disliking
        } catch (error) {
            console.error('Error disliking feedback:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    // Array of colors for name initials
    const colors = ['#FF5733', '#33FF7A', '#337AFF', '#FF33F4', '#FFE333', '#7AFF33', '#FF33A6'];

    return (
        <div>
            <div className="accepted-feedbacks-container" style={{ margin: '20px' }}>
                <h1>Service Feedbacks</h1>
                <ul className="feedbacks-list" style={{ listStyle: 'none', padding: 0 }}>
                    {acceptedFeedbacks.map((feedback, index) => (
                        <li key={feedback._id} className="feedback-item" style={{ background: '#f9f9f9', border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                            <div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: colors[index % colors.length], display: 'flex', justifyContent: 'center', alignItems: 'center', float: 'left', marginRight: '10px' }}>
                                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{feedback.name.charAt(0)}</span>
                                </div>
                                <p style={{ margin: '5px 0' }}><strong></strong> {feedback.name}</p>
                                <p style={{ margin: '5px 0' }}><strong></strong> {feedback.email}</p>
                                <p style={{ margin: '5px 0' }}><strong></strong>
                                    <span className="star-rating">
                                        {[...Array(feedback.starRating)].map((star, index) => (
                                            <FontAwesomeIcon key={index} icon={faStar} style={{ color: '#ffc107' }} />
                                        ))}
                                    </span>
                                </p>
                                <p style={{ margin: '5px 0' }}><strong></strong> {feedback.message}</p>
                                <div style={{ marginTop: '10px' }}>
                                    <button onClick={() => handleLike(feedback._id)} style={{ marginRight: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                                        <FontAwesomeIcon icon={faThumbsUp} style={{ color: 'green' }} /> Like ({feedback.likes})
                                    </button>
                                    <button onClick={() => handleDislike(feedback._id)} style={{ marginRight: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                                        <FontAwesomeIcon icon={faThumbsDown} style={{ color: 'red' }} /> Dislike ({feedback.dislikes})
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
