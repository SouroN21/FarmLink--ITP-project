import React, { useEffect, useState } from 'react';
import productService from '../../../redux/features/product/ProductService';
import ProductCard from '../../ProductCard/ProductCard';
import { Container, Spinner } from 'react-bootstrap';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const SpecialOffers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch all products by offers
                let res = await productService.getProdcutsByCategory("offers");

                // Filter products with price greater than 10
                res = res.filter(product => parseFloat(product.price) > 10)
                         .slice(0, 5); 
            
                setProducts(res);
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const settings = {
        dots: true,
      
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        pauseOnHover: false,
        autoplay: true, 
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1024, // Adjusted breakpoint
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ],

    };

    return (
        <div>
            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : products.length > 0 ? (
                <Container fluid>
                    <Slider {...settings}>
                        {products.map((product) => (
                            <div key={product._id} style={{ margin: '0 10px' }}> 
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </Slider>
                </Container>
            ) : (
                <div>No products found.</div>
            )}
        </div>
    );
};

export default SpecialOffers;
