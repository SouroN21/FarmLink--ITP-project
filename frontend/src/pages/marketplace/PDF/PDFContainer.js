import React from 'react';
import './PDFContainer.css';

const PDFContainer = ({ companyName, children }) => {
    return (
        <div id="report-container">
            <div className="company-info">
                <h1 className='pdfhead'>bjhvhv{companyName}</h1>
                
            </div>
            <table className="pdf-table">
                {children}
            </table>
        </div>
    );
}

export default PDFContainer;
