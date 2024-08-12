import { useEffect, useRef, useState } from 'react';
import { useCategory } from '../../../customHook/CategoryProvider';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoriesNav from '../../../components/bidding/CategoriesNav/CategoriesNav';
import BiddingCard from '../../../components/bidding/BiddingCard/BiddingCard';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import biddingService from "../../../services/biddingService";
import Search from '../../../components/search/Search';
import './BiddingList.css';
import Footer from '../../../components/footer/Footer';


import { useNavigate } from 'react-router-dom';
import GlobalStyles from '../../../GlobalStyles';


function BiddingList() {


    const [search, setSearch] = useState("");
    const [biddings, setBiddings] = useState([]);
    const [filteredBiddings, setFilteredBiddings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { category } = useCategory();
    const searchRef = useRef(null);
    const navigate = useNavigate();

    

  


    useEffect(() => {
        
        if (searchRef.current && searchRef.current.querySelector) {
            const input = searchRef.current.querySelector('input');
            if (input) {
                input.style.borderRadius = '25px'; 
            }
        }
    }, []);

    useEffect(() => {
        const fetchBiddings = async () => {
            setLoading(true);
            try {
                let res;
                if (category === 'all') {
                    res = await biddingService.getAllBiddings();
                    console.log("Bidding Result : ", res);
                } else {
                    res = await biddingService.getBiddingsByCategory(category);
                }
                // Extract the array from the response property
                const biddingsArray = res.response; // Assuming res is an object
                setBiddings(biddingsArray);
                setFilteredBiddings(biddingsArray);
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };
    
        fetchBiddings();
    }, [category]);
    
    

    useEffect(() => {
        const filtered = biddings.filter(bidding =>
            bidding.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredBiddings(filtered);
    }, [biddings, search]);

    return (
        <>
        <GlobalStyles/>
            
            <CategoriesNav />
            <Row className="justify-content-center mb-4">
                    <Col xs={4} md={8} lg={4}>
                    <div ref={searchRef}>
                        <Search value={search} onChange={(e) => setSearch(e.target.value)} />

                    </div>
                    </Col>
                </Row>

                

                
            <Container style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
             
                {!loading ? (
                    <InfiniteScroll
                        dataLength={filteredBiddings.length}
                        next={() => {}}
                        loader={<Spinner animation="border" />}
                        hasMore={false}
                    >
                        <Container fluid>
                            {Array.from({ length: Math.ceil(filteredBiddings.length / 3) }).map((_, index) => (
                                <Row key={index} className="mb-3">
                                    {filteredBiddings.slice(index * 3, (index + 1) * 3).map((bidding) => (
                                        <Col xs={12} md={4} key={bidding._id.toString()}> {/* Adjusted Col size */}
                                            <BiddingCard bidding={bidding} />
                                        </Col>
                                    ))}
                                </Row>
                            ))}
                        </Container>
                    </InfiniteScroll>
                ) : (
                    <div className="spinner">
                        <Spinner animation="border" />
                    </div>
                )}
               
            </Container>
            <div className='Footer'> <Footer /></div>
           
        </>
    );
}


export default BiddingList;
