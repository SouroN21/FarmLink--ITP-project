import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useCategory } from '../../../customHook/CategoryProvider';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoriesNav from '../../../components/Categories/CategoriesNav';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import productService from "../../../redux/features/product/ProductService";
import Search from '../../../components/search/Search';
import './Categories.css';
import Footer from '../../../components/footer/Footer';
import DualThumbRangeSlider from '../../../components/dualThumb/DualThumbRangeSlider'; // Make sure to import the actual slider component
import GlobalStyles from '../../../GlobalStyles';

function Categories() {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 300 });
    const [maxPrice, setMaxPrice] = useState(0);
    const { category } = useCategory();
    const searchRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
          setLoading(true);
          try {
            // Retrieve saved filters or default
            const savedFilters = localStorage.getItem('priceRangeFilters');
            const savedPriceRange = savedFilters ? JSON.parse(savedFilters) : { min: 0, max: 300 };
      
            // Fetch products
            const res = await (category === 'all'
              ? productService.getAllProducts()
              : productService.getProdcutsByCategory(category));
      
            // Determine maximum product price
            const maxProductPrice = Math.max(...res.map((p) => p.price));
            setMaxPrice(maxProductPrice);
      
            // Update price range, ensuring it's within fetched product prices
            setPriceRange((currentRange) => {
              const newMin = savedPriceRange.min;
              const newMax = savedPriceRange.max <= maxProductPrice ? savedPriceRange.max : maxProductPrice;
              localStorage.setItem('priceRangeFilters', JSON.stringify({ min: newMin, max: newMax }));
              return { min: newMin, max: newMax };
            }); 
      
            // Set products and filteredProducts
            setProducts(res);
            const filtered = res.filter((product) => {
              return product.price >= savedPriceRange.min && product.price <= savedPriceRange.max;
            });
            setFilteredProducts(filtered);
          } catch (err) {
            console.error(err);
          }
          setLoading(false);
        };
      
        fetchProducts();
      }, [category]);
      
    useEffect(() => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase()) &&
            product.price >= priceRange.min && product.price <= priceRange.max
        );
        setFilteredProducts(filtered);
    }, [products, search, priceRange]);

    const handlePriceRangeChange = useCallback(([minValue, maxValue]) => {
        const newRange = { min: minValue, max: maxValue };
        setPriceRange(newRange);
        localStorage.setItem('priceRangeFilters', JSON.stringify(newRange));
    }, []); // Empty dependency array signifies this callback will never change


  return (
    <>
    <GlobalStyles/>
        <CategoriesNav />
        <Container fluid>
            <Row>
                <Col md={2} className="filter-sidebar" > 
                    <div className="price-range-filter">
                        <label style={{marginBottom: '4.5rem'}}>Price Range: ${priceRange.min} - ${priceRange.max}</label>
                        <DualThumbRangeSlider
                            min={0}
                            max={maxPrice}
                            values={[priceRange.min, priceRange.max]}
                            onChange={handlePriceRangeChange}
                        />
                    </div>
                    
                </Col>
                <Col md={9}> {/* Main content */}
                    <Row className="justify-content-center mb-4">
                        <Col xs={12} lg={8}>
                            <div ref={searchRef}>
                                <Search value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                        </Col>
                    </Row>
                    <Container style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                        {/* Products and infinite scroll */}
                        {!loading ? (
                            <InfiniteScroll style={{ overflow: 'hidden' }}
                                dataLength={filteredProducts.length}
                                next={() => {}}
                                hasMore={false}
                                loader={<Spinner animation="border" />}
                            >
                                <Row>
                                    {filteredProducts.map((product) => (
                                        <Col xs={8} md={5} lg={3} key={product._id.toString()}>
                                            <ProductCard product={product} />
                                        </Col>
                                    ))}
                                </Row>
                            </InfiniteScroll>
                        ) : (
                            <div className="spinner">
                                <Spinner animation="border" />
                            </div>
                        )}
                    </Container>
                    <Footer />
                </Col>
            </Row>
        </Container>
    </>
);

}

export default Categories;
