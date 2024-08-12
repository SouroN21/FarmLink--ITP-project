import React from 'react';
import { FaMoneyBillWave, FaUsers, FaShippingFast, FaLock, FaShieldAlt } from 'react-icons/fa';

const FeatureBar = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  padding: '10px 0' }}>
      <h4 style={{marginLeft:'20rem', fontSize:'3rem'}}>Better choices,<br/> better prices</h4>
      <div style={{ display: 'flex', marginRight: "15rem"}}>
        <div style={{ marginRight: '15px', textAlign: 'center' }}>
          <FaMoneyBillWave size={20} style={{marginLeft:"4.5rem"}} />
          <p>Value-for-money</p>
          <span style={{fontSize: "0.85rem"}}>We offer competitive prices on <br/>millions of items</span>
        </div>
        <div style={{ marginRight: '15px', textAlign: 'center' }}>
          <FaUsers size={20} style={{marginLeft:"4.5rem"}}/>
          <p>Shoppers worldwide</p>
          <span style={{fontSize: "0.85rem"}}>More than 300 million shoppers <br/>from 200+ countries & regions</span>
        </div>
        <div style={{ marginRight: '15px', textAlign: 'center' }}>
          <FaShippingFast size={20} style={{marginLeft:"4.5rem"}} />
          <p>Fast delivery</p>
          <span style={{fontSize: "0.85rem"}}>Faster delivery on selected items thanks to <br/>our improved logistics</span>
        </div>
        <div style={{ marginRight: '15px', textAlign: 'center' }}>
          <FaLock size={17}  style={{marginLeft:"4.5rem"}}/>
          <p>Safe payments</p>
          <span style={{fontSize: "0.85rem"}}>Safe payment methods preferred <br/>by international shoppers</span>
        </div>
        <div style={{ marginRight: '15px', textAlign: 'center' }}>
          <FaShieldAlt size={17}  style={{marginLeft:"4.5rem"}}/>
          <p>Buyer protection</p>
          <span style={{fontSize: "0.85rem"}}>Get a refund if items arrive late or<br/> not as described</span>
        </div>
       
      </div>
    </div>
  );
};

export default FeatureBar;
