import React, { useState, useEffect } from 'react';
import './ProductsTable.css'; 
import productService from '../../redux/features/product/ProductService';

const ProductsTable = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch all products
                let res = await productService.getAllProducts();
    
                setProducts(res);
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <table className="products-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>SKU</th> {/* New header for SKU */}
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => (
                    <tr key={product.id || index}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>${product.price}</td>
                        <td>{product.quantity}</td>
                        <td>{product.sku}</td> {/* Render SKU */}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProductsTable;
