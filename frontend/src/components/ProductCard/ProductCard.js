import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import Moment from 'react-moment';
import { Link, useNavigate } from 'react-router-dom';
import './ProductCard.css';
import productService from '../../redux/features/product/ProductService';
import authService from '../../services/authService';

function ProductCard({ product }) {
    const navigate = useNavigate();
    const [isHovering, setIsHovering] = useState(false);
    const imagePath = product?.image?.filePath;
    const productPrice = parseFloat(product?.price).toFixed(2);
    const [productOwner, setProductOwner] = useState(null);
    const [error, setError] = useState('');

    // Handle the preview action here
    const handlePreview = () => {
        navigate(`/product/${product?._id}`);
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const fetchedProduct = await productService.getProduct(product._id);

                if (fetchedProduct.user) {
                    const owner = await authService.getUserById(fetchedProduct.user);
                    setProductOwner(owner);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch product');
            }
        };
        fetchProductDetails();
    }, [product._id]);

    return (
        <Card
            className={`my-3 p-3 custom-rounded product-card ${product.quantity <= 0 ? 'out-of-stock' : ''}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {imagePath && (
                <Link to={`/product/${product?._id}`}>
                    <Card.Img src={imagePath} variant="top" />
                </Link>
            )}
            <Card.Body>
                <Link to={`/product/${product?._id}`}>
                    <Card.Title as="div">
                        <strong className="hover-green">{product?.name}</strong>
                    </Card.Title>
                </Link>
                {!product.offer && ( <Card.Text as="h3">${productPrice}</Card.Text>)}
                {product.offer && (
                     <>
                    <div className="price-offer">
                
                    {/* Discounted price */}
                    <h4 className="discounted-price">
                        $ {product.price-(product.price * product.offer.discount) / 100} 
                    </h4>
                    {/* Original price with a strikethrough */}
                    <h4 className="original-price">
                        <span style={{ textDecoration: 'line-through' }}>
                         ${product.price}
                        </span>
                    </h4>
                    <div className="discount-percentage">
                        -{product.offer.discount}%
                    </div>
                    </div>
                    <Card.Text as="div" className="offer-text">
                    Offer  Ends:{' '}{<Moment format="DD/MM/YYYY">{product.offer.endDate}</Moment>}
                    </Card.Text>
                   {product.offer.coupon&& <Card.Text as="div" className="offer-coupon">
                   <div className="offer-coupon-text">
                          Use below coupon To Get Offer
                    </div>  
                    <div className="offer-coupon-code">
                    {product.offer.coupon}
                    </div>
              
                    </Card.Text>
                    }
                </>

                )}

                  
                <Card.Text as="div">
                    <small className="text-muted">
                        <Moment format="DD/MM/YYYY">{product?.createdAt}</Moment>
                    </small>
                </Card.Text>
                {product.quantity <= 0 ? (
                    <div className="out-of-stock-message">Out of stock</div>
                ) :null}
            <span>{productOwner?.firstName}</span>
            </Card.Body>
        </Card>
    );
}

export default ProductCard;
