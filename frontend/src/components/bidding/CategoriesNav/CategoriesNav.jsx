
import React from 'react';
import { Button } from 'react-bootstrap';
import './CategoriesNav.css';
import { GiGrain } from "react-icons/gi";
import { FaCarrot, FaAppleAlt, FaBorderAll } from "react-icons/fa";
import { useCategory } from '../../../customHook/CategoryProvider'; // Adjust the import path as needed

function CategoriesNav() {
    const { setCategory } = useCategory(); // Using the setCategory function from context

    return (
        <div className="container" id="categories">
            <h1>Categories</h1>
            <div className="divider">
                <Button variant="dark" id='all' onClick={() => setCategory('all')}><FaBorderAll />All</Button>{' '}
                <Button variant="dark" id='fruits' onClick={() => setCategory('Fruit')}><FaAppleAlt />Fruits</Button>{' '}
                <Button variant="dark" id='vegetables' onClick={() => setCategory('Vegetable')}><FaCarrot />Vegetables</Button>{' '}
                <Button variant="dark" id='grain' onClick={() => setCategory('Grain')}><GiGrain />Grains</Button>{' '}
            </div>
        </div>
    );
}

export default CategoriesNav;
