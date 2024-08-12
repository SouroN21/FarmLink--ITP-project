import React, { useEffect, useState } from 'react';
import productService from '../../../redux/features/product/ProductService';
import ProductCard from '../../ProductCard/ProductCard';
import { Container, Spinner } from 'react-bootstrap';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const TopSellingProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch all products
                let res = await productService.getAllProducts();
              
                // Filter products with price greater than 10
                res = res.filter(product => parseFloat(product.price) > 10)
                         .slice(0, 5); // Assuming you still want the most recent 10 products
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
        ]
    };

    return (
        <div>
            <h2>Top Selling Products</h2>
            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : products.length > 0 ? (
                <Container fluid>
                    <Slider {...settings}>
                        {products.map((product) => (
                            <div key={product._id}>
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

export default TopSellingProducts;
