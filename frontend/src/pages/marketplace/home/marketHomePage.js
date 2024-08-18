import React from 'react';
import RecentlyAddedProducts from '../../../components/marketPlace/RecentlyAddedProducts/RecentlyAddedProducts';
import TopSellingProducts from '../../../components/marketPlace/TopSellingProducts/TopSellingProducts';
import FeatureBar from '../../../components/marketPlace/FeatureBar/FeatureBar';
import GlobalStyles from '../../../GlobalStyles';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SpecialOffers from '../../../components/marketPlace/SpecialOffers/SpecialOffers';

import './HomePage.css';
import IMG1 from "./img1.jpg";
import IMG2 from "./img2.jpg";
import IMG3 from "./img3.jpg";
import IMG4 from "./img4.jpg"; 
import Footer from '../../../components/footer/Footer';
const MarketplaceHomePage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2.3,  
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
  };
  


  const farmers = [
    {
      img: IMG2,
      name: 'Ashen Tennakoon',
      description: 'Ashen has been a leading organic vegetable farmer for over 10 years.'
    },
    {
      img: IMG1,
      name: 'Shanuka Bandara',
      description: 'Shanuka specializes in sustainable farming practices in the heartland of our country.'
    },
    {
      img: IMG3,
      name: 'Chamidu Perera',
      description: 'Chamidu is known for her innovative approaches to permaculture and local farming.'
    },
    {
      img: IMG4,
      name: 'Maniya De Soisa',
      description: 'Naveen has been instrumental in introducing new farming technologies in our region.'
    }
  ];
  

  return (
    <div className="homepage">
      <GlobalStyles/>
      <h1 className='text-center'>Discover Exceptional Deals at Our Premier Marketplace!</h1>
      <Slider {...settings}>
        {farmers.map((farmer, index) => (
          <div key={index} className="slider-item">
            <img src={farmer.img} alt={farmer.name} style={{ width: '100%', height: 'auto' }}/>
            <div className="farmer-info">
              <h3 style={{color:"white"}}>{farmer.name}</h3>
              <p style={{color:"white"}}>{farmer.description}</p>
            </div>
          </div>
        ))}
      </Slider>
      <section className="feature-section">
        <FeatureBar />
      </section>
      <section className="recent-products">
        <div className="section-content">
          <RecentlyAddedProducts />
        </div>
      </section>
      <section className="special-offers">
        <h2>Special Offers</h2>
        <SpecialOffers />
      </section>
      <section className="top-selling">
        <div className="section-content">
          <TopSellingProducts />
        </div>
      </section>
      <section className="top-sellers">
        <h2>Top Sellers</h2>
        <div className="section-content" style={{backgroundColor: '#d9edf7'}}>
          Product Owners with Highest Sales Here
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default MarketplaceHomePage;
