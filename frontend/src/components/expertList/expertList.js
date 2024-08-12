import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './expertList.scss';
import GlobalStyles from '../../GlobalStyles';

class ExpertDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experts: [],
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch('http://localhost:5000/expertlisting');
      if (response.ok) {
        const data = await response.json();
        this.setState({ experts: data });
      } else {
        console.error('Failed to fetch experts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching experts:', error);
    }
  }

  render() {
    const { experts } = this.state;

    return (

      <div className="expert-details">
        <GlobalStyles/>
        <h1 className="expert-details-title">Expert Details</h1>
        <div className="expert-card-container">
          {experts.map((expert) => (
            <div key={expert._id} className="expert-card">
              <h2 className="expert-name">{expert.name}</h2>
              <img
                className="expert-picture"
                src={`http://localhost:5000/uploads/${expert.picture}`}
                alt={expert.name}
              />
              <p className="expert-email">Email: {expert.email}</p>
              <p className="expert-expertise">Expertise: {expert.expertise}</p>
              <p className="expert-location">Location: {expert.location}</p>
              <Link to={`/appointment-form?expertId=${expert._id}`}>
                <button type="submit" className="submit-button">Appointment</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ExpertDetails;
