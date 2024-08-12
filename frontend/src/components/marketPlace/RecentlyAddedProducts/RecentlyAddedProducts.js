import React, { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import Slider from 'react-slick'; 
import productService from '../../../redux/features/product/ProductService';
import ProductCard from '../../ProductCard/ProductCard';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './RedentlyAddedProduct.css';
const RecentlyAddedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let res = await productService.getAllProducts();
                res = res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
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
        pauseOnHover: false,
        slidesToShow: 5,
        slidesToScroll: 1.5,
        autoplay: true, 
        autoplaySpeed: 4000, 
        responsive: [
            {
                breakpoint: 10,
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
            <h2>Recently Added Products</h2>
            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : products.length > 0 ? (
                <Container fluid>
                    <Slider {...settings}>
                        {products.map((product) => (
                            <div key={product._id}>
                                <div className="small-product-card"> 
                                    <ProductCard product={product} />
                                </div>
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

export default RecentlyAddedProducts;
