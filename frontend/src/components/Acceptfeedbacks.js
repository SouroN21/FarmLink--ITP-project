import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FaDownload } from 'react-icons/fa'; // Importing download icon
import StarRating from './StarRating'; // Assuming StarRating component is in the same directory
import RatingPieChart from './Ratingpiechart'; // Importing the Pie Chart component

export default function AcceptFeedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedRow, setHighlightedRow] = useState(null); // Changed initial state to null

    useEffect(() => {
        getFeedbacks();
    }, []);

    const getFeedbacks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/feedback");
            setFeedbacks(response.data);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            alert("Failed to fetch feedbacks");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/feedback/delete/${id}`);
            setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
            alert("Feedback deleted successfully");
        } catch (error) {
            console.error('Error deleting feedback:', error);
            alert("Failed to delete feedback");
        }
    };

    const handleAccept = async (id) => {
        try {
            await axios.put(`http://localhost:5000/feedback/accept/${id}`);
            alert("Feedback accepted successfully");
        } catch (error) {
            console.error('Error accepting feedback:', error);
            alert("Failed to accept feedback");
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/feedback/delete/${id}`);
            setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
            alert("Feedback rejected successfully");
        } catch (error) {
            console.error('Error rejecting feedback:', error);
            alert("Failed to reject feedback");
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setHighlightedRow(null);

        const index = feedbacks.findIndex(feedback => feedback.name.toLowerCase().includes(query));
        if (index !== -1) {
            setHighlightedRow(index);
        }
    };

    // Calculate ratings for the Pie Chart
    const ratings = Array(5).fill(0); // Initialize an array of length 5 with zeros
    feedbacks.forEach(feedback => {
        ratings[feedback.starRating - 1]++;
    });

    const MyDocument = () => (
        <Document>
            <Page size="A4">
                <View style={styles.page}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Feedback Summary</Text>
                    </View>
                    <Text>Total Number of Ratings: {feedbacks.length}</Text>
                    <Text>Percentage of Each Rating:</Text>
                    {ratings.map((count, index) => (
                        <Text key={index}>{`${index + 1}/5 Ratings: ${(count / feedbacks.length * 100).toFixed(2)}%`}</Text>
                    ))}
                    <View style={styles.signatureDate}>
                        <Text style={styles.signature}>Signature: __________________________</Text>
                        <Text style={styles.date}>Date: {new Date().toLocaleDateString()}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            padding: 20,
        },
        header: {
            alignItems: 'center',
            marginBottom: 20,
        },
        title: {
            fontSize: 20,
        },
        signatureDate: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
        },
        signature: {
            marginRight: 'auto',
        },
        date: {
            marginLeft: 'auto',
        },
        table: {
            display: 'table',
            width: '100%',
            borderCollapse: 'collapse',
        },
        tableRow: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#000',
            borderBottomStyle: 'solid',
        },
        headerCell: {
            fontSize: 12,
            fontWeight: 'bold',
            padding: 8,
        },
        cell: {
            fontSize: 12,
            padding: 8,
        },
        highlightedRow: {
            backgroundColor: '#ffffcc',
        },
        searchBar: {
            position: 'absolute',
            top: 10, // Adjusted top position
            left: 10,
            padding: '5px',
            borderRadius: '5px',
            border: '1px solid #aaa',
            fontSize: '14px',
        },
        downloadButton: {
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'black',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
        },
        downloadIcon: {
            marginRight: '5px',
        },
        acceptedButton: {
            backgroundColor: 'green',
            color: 'white',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '5px',
        },
        rejectedButton: {
            backgroundColor: 'red',
            color: 'white',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '5px',
        },
    });

    return (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
            <h1>Customer Feedbacks</h1>
            <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={handleSearch}
                style={styles.searchBar}
            />
            <PDFDownloadLink document={<MyDocument />} fileName="feedback_summary.pdf">
                {({ loading }) => (
                    <button style={styles.downloadButton}>
                        <FaDownload style={styles.downloadIcon} />
                        {loading ? 'Loading...' : 'Download'}
                    </button>
                )}
            </PDFDownloadLink>
            {/* Add some space */}
            <div style={{ marginBottom: '20px' }}></div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2' }}>Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2' }}>Email</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2' }}>Message</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2' }}>Star Rating</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.map((feedback, index) => (
                        <tr key={feedback._id} style={highlightedRow === index ? { backgroundColor: '#ffffcc' } : null}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{feedback.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{feedback.email}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{feedback.message}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{feedback.starRating}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                {feedback.status !== 'Accepted' ? (
                                    <>
                                        <button className={styles.acceptedButton} onClick={() => handleAccept(feedback._id)}>Accept</button>
                                        <button className={styles.rejectedButton} onClick={() => handleReject(feedback._id)}>Reject</button>
                                    </>
                                ) : (
                                    <span>Accepted</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Integration of Pie Chart */}
            <RatingPieChart ratings={ratings} />
        </div>
    );
}
