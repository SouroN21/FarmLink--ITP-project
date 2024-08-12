
import React from 'react';

const ProductDetails = ({ product }) => {
  return (
    
    <div>
      <h3>{product.name}</h3>
      <p>Category: {product.category}</p>
      <p>Quantity: {product.quantity}</p>
      <p>Price: {product.price}</p>
    </div>
  );
};

export default ProductDetails;
