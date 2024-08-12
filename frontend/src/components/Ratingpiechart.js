import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

const RatingPieChart = ({ ratings }) => {
    // Function to get color based on rating index
    const getColorForRating = (index) => {
        switch (index) {
            case 0:
                return '#ff0000'; // Red for 1/5 rating
            case 1:
                return '#ff9900'; // Orange for 2/5 rating
            case 2:
                return '#ffff00'; // Yellow for 3/5 rating
            case 3:
                return '#33cc33'; // Green for 4/5 rating
            case 4:
                return '#3399ff'; // Blue for 5/5 rating
            default:
                return '#aaa'; // Default color for other ratings
        }
    };

    // Calculate total number of ratings
    const totalRatings = ratings.reduce((acc, rating) => acc + rating, 0);

    // Calculate percentage for each rating
    const data = ratings.map((rating, index) => ({
        value: (rating / totalRatings) * 100,
        color: getColorForRating(index), // Get color based on rating index
        description: `${(rating / totalRatings * 100).toFixed(2)}%`, // Rating percentage
    }));

    const defaultRadius = 20; // Set a default value for radius if PieChart.defaultProps.radius is undefined

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h2>Our Service Feedback Report</h2>
            <div style={{ marginBottom: '20px' }}>
                <PieChart
                    data={data}
                    radius={40} // Adjust the size of the pie chart as needed
                    label={({ dataEntry }) => dataEntry.description} // Display percentage in the chart
                    labelStyle={{
                        fontSize: '5px',
                        fontFamily: 'sans-serif',
                        fill: '#fff',
                    }}
                />
            </div>
            {/* Display rating descriptions */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                {data.map((entry, index) => (
                    <div key={index} style={{ marginRight: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                            <div style={{ width: '10px', height: '10px', backgroundColor: entry.color, marginRight: '5px' }} />
                            <span>{entry.description}</span>
                        </div>
                    </div>
                ))}
            </div>
            {/* Display color legend */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                {data.map((entry, index) => (
                    <div key={index} style={{ marginRight: '10px', textAlign: 'center' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: entry.color, marginRight: '5px', marginBottom: '5px' }} />
                        <span>{`${index + 1}/5 Stars`}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingPieChart;
