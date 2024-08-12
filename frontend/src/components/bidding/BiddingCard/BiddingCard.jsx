import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import Moment from 'react-moment';
import { Link, useNavigate } from 'react-router-dom';
import './BiddingCard.css';
import biddingService from '../../../services/biddingService';
import authService from '../../../services/authService';
import Post from '../Post';




function BiddingCard({ bidding }) {
    const navigate = useNavigate();
    const [isHovering, setIsHovering] = useState(false);
    const imagePath = bidding?.image?.filePath;
    const [productOwner, setProductOwner] = useState("");
    const [error, setError] = useState('');
    

    // Handle the preview action here
    const handlePreview = () => {
        navigate(`/bidding/${bidding?._id}`);
    };

    useEffect(() => {
        const fetchProductDetails = async () => {

            try {
                const fetchedProduct = await biddingService.getBidding(bidding._id);
                if (fetchedProduct.bidding.user) {
                    const owner = await authService.getUserById(fetchedProduct.bidding.user);
                    setProductOwner(owner);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch product');
            }
        };
        fetchProductDetails();
    }, [bidding._id]);

   

    return (
        <Card
            className={`my-3 p-3 custom-rounded product-card`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {imagePath && (
                <Link to={`/bidding/${bidding?._id}`}>
                    <Card.Img src={imagePath} variant="top" />
                </Link>
            )}
            <Card.Body>
                
                <Link to={`/bidding/${bidding?._id}`}>
                    <Card.Title as="div">
                        <strong className="hover-green">{bidding?.title}</strong>
                    </Card.Title>
                </Link>
                <Card.Text as="div">
                    <p>Location: {bidding.location}</p>
                    <p>Category: {bidding.category}</p>
                    <p>Owner: {productOwner?.firstName}</p>
                </Card.Text>

                
                
                

            </Card.Body>
        </Card>
    );
}

export default BiddingCard;

