import React from 'react';
import { Button } from 'react-bootstrap';
import './Categories.css';
import { FaCarrot, FaAppleAlt, FaBorderAll,FaTags } from "react-icons/fa";
import { useCategory } from '../../customHook/CategoryProvider';


function CategoriesNav() {
    const { setCategory } = useCategory(); 
    return (
        <div className="container" id="categories">
            <h1>Categories</h1>
            <div className="divider">
                <Button 
                    variant="success" // Change to a color associated with agriculture, such as green
                    id='all' 
                    style={{ width: 'auto', height: 'auto' }} 
                    onClick={() => setCategory('all')}
                >
                    <FaBorderAll />All
                </Button>{' '}
                <Button 
                    variant="warning" // Change to a color associated with fruits, such as orange
                    id='fruits' 
                    style={{ width: 'auto', height: 'auto' }}
                    onClick={() => setCategory('Fruit')}
                >
                    <FaAppleAlt />Fruits
                </Button>{' '}
                <Button 
                    variant="info" // Change to a color associated with vegetables, such as green
                    id='vegetables' 
                    style={{ width: 'auto', height: 'auto' }} 
                    onClick={() => setCategory('Vegetable')}
                >
                    <FaCarrot />Vegetables
                </Button>{' '}

                <Button variant="success" id='offers' style={{ width: 'auto', height: 'auto' }}  onClick={() => setCategory('offers')}><FaTags />Offers</Button>{' '}

            </div>
        </div>
    );
}

export default CategoriesNav;
